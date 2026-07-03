const { Category, db } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Lấy danh sách Category
exports.getCategories = async (req, res) => {
  try {
    const { limit = 12, page = 1 } = req.query;
    const offset = (page - 1) * limit;
    const { count, rows} = await Category.findAndCountAll({
      where: { status: true },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['display_order', 'ASC']]
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error getting active categories:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách loại',
      error: error.message
    });
  }
};

// Lấy chi tiết 1 category
exports.getCategoryDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy loại'});
    }

    res.json({ success: true, data: category });
  } catch (error) {
    console.error('Error getting category detail:', error);
    res.status(500).json({
      success: false, message: 'Lỗi khi lấy chi tiết loại', error: error.message
    });
  }
};


// POST create new category
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, display_order, status } = req.body;
    
    // Validate required fields
    if (!name || !slug) {
      // Xóa file đã upload nếu validation fail
      if (req.file) {
        deleteFile(`public/category/${req.file.filename}`);
      }
      return res.status(400).json({
        success: false,
        message: 'Tên và slug là bắt buộc'
      });
    }
    
    // Check if slug already exists
    const existingCategory = await Category.findOne({
      where: { slug }
    });
    
    if (existingCategory) {
      // Xóa file đã upload nếu slug trùng
      if (req.file) {
        deleteFile(`public/category/${req.file.filename}`);
      }
      return res.status(400).json({
        success: false,
        message: 'Slug đã tồn tại'
      });
    }
    
    // Lấy đường dẫn file icon nếu có upload
    const icon = req.file ? `/images/category/${req.file.filename}` : null;
    
    const newCategory = await Category.create({
      name,
      slug,
      icon,
      display_order: display_order || 0,
      status: status || 'active'
    });
    
    res.status(201).json({
      success: true,
      message: 'Tạo category thành công',
      data: newCategory
    });
  } catch (error) {
    // Xóa file đã upload nếu có lỗi
    if (req.file) {
      deleteFile(`public/category/${req.file.filename}`);
    }
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo category',
      error: error.message
    });
  }
};

// PUT update category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, display_order, status } = req.body;
    
    const category = await Category.findOne({
      where: { id}
    });
    
    if (!category) {
      // Xóa file mới upload nếu không tìm thấy category
      if (req.file) {
        deleteFile(`public/category/${req.file.filename}`);
      }
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy category'
      });
    }
    
    // Check if new slug conflicts with another category
    if (slug && slug !== category.slug) {
      const existingCategory = await Category.findOne({
        where: { 
          slug, 
          id: { [Op.ne]: id } 
        }
      });
      
      if (existingCategory) {
        // Xóa file mới upload nếu slug trùng
        if (req.file) {
          deleteFile(`public/category/${req.file.filename}`);
        }
        return res.status(400).json({
          success: false,
          message: 'Slug đã tồn tại'
        });
      }
    }
    

    // Xử lý icon
    let iconPath = category.icon;
    if (req.file) {
      // Xóa icon cũ nếu có
      if (category.icon) {
        deleteFile(`public${category.icon}`);
      }
      iconPath = `/images/category/${req.file.filename}`;
    }
    
    await category.update({
      name: name || category.name,
      slug: slug || category.slug,
      icon: iconPath,
      display_order: display_order !== undefined ? display_order : category.display_order,
      status: status || category.status,
      updated_at: new Date()
    });
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật category thành công',
      data: category
    });
  } catch (error) {
    // Xóa file mới upload nếu có lỗi
    if (req.file) {
      deleteFile(`public/category/${req.file.filename}`);
    }
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật category',
      error: error.message
    });
  }
};

// DELETE category (soft delete)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findOne({
      where: { id }
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy category'
      });
    }
    
    // Soft delete - không xóa file icon
    await category.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Xóa category thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa category',
      error: error.message
    });
  }
};

// Helper function to delete old file
const deleteFile = (filePath) => {
  if (filePath) {
    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
};