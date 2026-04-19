const router = require("express").Router();
const Product = require("../models/product");
const Category = require("../models/Category");
const Likes = require("../models/likes");

// @route POST api/products/add
// @desc Create new product
// @access Public
router.post("/add", async (req, res) => {
  const { name, description, price, category, stock, image, size } = req.body;

  if (!name || !description || !price || !category || !stock || !image) {
    return res.status(400).json({ message: "Please enter all required data" });
  }

  try {
    // Verify the category exists and populate it
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    // Convert size string to array if provided
    const sizeArray = size ? size.split(',').map(s => s.trim()) : [];

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      image,
      size: sizeArray // Store as an array
    });

    // Populate the category field before saving
    await newProduct.populate('category');
    const product = await newProduct.save();
    const populatedProduct = await Product.findById(product._id).populate('category');
    
    // Add like count to the response
    const likeCount = await Likes.countDocuments({ product: product._id });
    res.status(200).json({ 
      message: "Product created successfully",
      product: { ...populatedProduct.toObject(), likeCount }
    });
  } catch (err) {
    console.error("Create product error:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// @route GET api/products
// @desc Get all products with like counts
// @access Public
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    
    // Add like count to each product
    const productsWithLikes = await Promise.all(products.map(async (product) => {
      const likeCount = await Likes.countDocuments({ product: product._id });
      return { ...product.toObject(), likeCount };
    }));
    
    res.status(200).json(productsWithLikes);
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @route GET api/products/:id
// @desc Get single product with like count
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    // Add like count to the response
    const likeCount = await Likes.countDocuments({ product: product._id });
    res.status(200).json({ ...product.toObject(), likeCount });
  } catch (err) {
    console.error("Get product error:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// @route PUT api/products/:id
// @desc Update product
// @access Public
router.put("/:id", async (req, res) => {
  const { name, description, price, category, stock, image, size } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Verify the category exists if provided
    let categoryToUse = product.category;
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      categoryToUse = category;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = categoryToUse;
    product.stock = stock !== undefined ? stock : product.stock;
    product.image = image || product.image;
    // Update size if provided, otherwise keep existing
    product.size = size !== undefined ? size.split(',').map(s => s.trim()) : product.size;

    // Populate the category field before saving
    await product.populate('category');
    const updatedProduct = await product.save();
    const populatedProduct = await Product.findById(updatedProduct._id).populate('category');
    
    // Add like count to the response
    const likeCount = await Likes.countDocuments({ product: updatedProduct._id });
    res.status(200).json({ 
      message: "Product updated successfully",
      product: { ...populatedProduct.toObject(), likeCount }
    });
  } catch (err) {
    console.error("Update product error:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// @route DELETE api/products/:id
// @desc Delete product and associated likes
// @access Public
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete associated likes
    await Likes.deleteMany({ product: req.params.id });

    await Product.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Product and associated likes deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;