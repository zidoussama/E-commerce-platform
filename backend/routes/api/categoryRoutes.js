const router = require("express").Router();
const Category = require("../../models/Category");
const Product = require("../../models/product");

// @route POST api/categories/add
// @desc Create a new category
// @access Public
router.post("/add", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    const newCategory = new Category({ name });
    const category = await newCategory.save();
    res.status(201).json({
      message: "Category created successfully",
      category
    });
  } catch (err) {
    console.error("Create category error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Category with this name already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// @route GET api/categories
// @desc Get all categories
// @access Public
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    console.error("Get categories error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @route GET api/categories/:id
// @desc Get a single category by ID
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (err) {
    console.error("Get category error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @route PUT api/categories/:id
// @desc Update a category
// @access Public
router.put("/:id", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = name;
    const updatedCategory = await category.save();
    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory
    });
  } catch (err) {
    console.error("Update category error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Category with this name already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// @route DELETE api/categories/:id
// @desc Delete a category
// @access Public
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if any products are using this category
    const products = await Product.find({ category: req.params.id });
    if (products.length > 0) {
      return res.status(400).json({ message: "Cannot delete category with associated products" });
    }

    await Category.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Delete category error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;