const categoryService = require('../services/categoryService');

exports.addCategory = async (req, res) => {
  const { category_name } = req.body;

  // 1. Validate input
  if (!category_name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    // 2. Call service
    const categoryId = await categoryService.addCategory(category_name);

    // 3. Send response
    return res.status(201).json({
      message: "Category added successfully",
      categoryId,
    });
  } catch (err) {
    console.error(" Error adding category:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.getCategory = async (req, res) => {
  try {
    const categories  = await categoryService.getCategory();
    res.json(categories );
  } catch (err) {
    console.error("Category error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.editCategory = async (req, res) => {
  const { id , category_name} = req.body;
  if (!id) {
    return res.status(400).json({ message: "Please provide id" });
  }
  try {
    const affectedRows = await categoryService.editCategory(id,category_name);  
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Category not found or no changes made" });
    }
    res.json({ message: "Category updated successfully" });
  } catch (err) {
    console.error("EditCategory error:", err);
    res.status(500).json({ message: "Server error" });  
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Please provide id" });
  }
  try {
    const affectedRows = await categoryService.deleteCategory(id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Category not found or no changes made" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("deleteCategory error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

