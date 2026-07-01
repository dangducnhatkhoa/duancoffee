const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController.js');
const upload = require('../middleware/uploadIconCategory.js');

// Lấy danh sách category
router.get('/', categoryController.getCategories);

// Lấy chi tiết 1 category
router.get('/:id', categoryController.getCategoryDetail);


//admin category routes

// POST create new category (with file upload)
router.post('/', upload.single('icon'), categoryController.createCategory);

// PUT update category by ID (with file upload)
router.put('/:id', upload.single('icon'), categoryController.updateCategory);

// DELETE category by ID (soft delete)
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;

