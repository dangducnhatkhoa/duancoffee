const { Order, Payment, db } = require('../models');

exports.handleWebhook = async (req, res) => {
  const t = await db.transaction();
  try {
    // 1. Verify SePay API Key
    const apiKey = req.headers['x-api-key'] || req.headers['authorization'];
    const expectedApiKey = process.env.SEPAY_API_KEY || 'sepay_secret_token_123';
    
    // Support formats: "x-api-key: KEY" or "Authorization: Apikey KEY" or "Authorization: Bearer KEY"
    let token = apiKey;
    if (apiKey && apiKey.startsWith('Apikey ')) {
      token = apiKey.substring(7).trim();
    } else if (apiKey && apiKey.startsWith('Bearer ')) {
      token = apiKey.substring(7).trim();
    }

    if (!token || token !== expectedApiKey) {
      await t.rollback();
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid API Key'
      });
    }

    const {
      id, // SePay transaction ID
      gateway,
      transactionDate,
      transferType,
      transferAmount,
      content,
      transactionContent,
      referenceCode
    } = req.body;

    const actualContent = content || transactionContent || '';

    console.log('Received SePay Webhook:', req.body);

    // Only process incoming transfers
    if (transferType !== 'in') {
      await t.rollback();
      return res.json({
        success: true,
        message: 'Ignored: Not an incoming transfer'
      });
    }

    // 2. Parse Order Number from transactionContent
    // Matches ORD-xxxxxxxxxxxxx-xxxxxx or DHxxxxxxxxxxxxx
    const regex = /(ORD-\d+-[a-zA-Z0-9]+|DH\d+)/i;
    const match = String(actualContent || '').match(regex);
    const order_number = match ? match[1] : null;

    if (!order_number) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Could not extract order number from transaction content'
      });
    }

    // 3. Find Order
    const order = await Order.findOne({
      where: { order_number: order_number },
      transaction: t
    });

    if (!order) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: `Order ${order_number} not found`
      });
    }

    // Check if already paid
    if (order.payment_date) {
      await t.rollback();
      return res.json({
        success: true,
        message: `Order ${order_number} was already marked as paid`
      });
    }

    // 4. Update Order Status
    // Update payment_date (marks payment_status as paid) and set order status
    const currentStatus = order.status;
    const newStatus = ['pending', 'cho_xac_nhan'].includes(currentStatus) ? 'dang_xu_ly' : currentStatus;

    await order.update({
      payment_date: new Date(transactionDate || Date.now()),
      status: newStatus
    }, { transaction: t });

    // 5. Create Payment Log
    await Payment.create({
      order_id: order.id,
      payment_method: 'bank_transfer',
      payment_amount: transferAmount || order.total_amount,
      transaction_id: String(id || referenceCode || ''),
      gateway_response: req.body,
      status: 'completed',
      payment_date: new Date(transactionDate || Date.now()),
      notes: `SePay transaction ${id} via ${gateway || 'Bank'}. Content: "${actualContent}"`
    }, { transaction: t });

    await t.commit();
    
    return res.json({
      success: true,
      message: `Successfully processed payment for order ${order_number}`
    });

  } catch (error) {
    await t.rollback();
    console.error('Error handling SePay Webhook:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};
