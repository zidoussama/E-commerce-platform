const Product = require('../models/product');
const Category = require('../models/Category');
const Likes = require('../models/likes');

class ProductController {
  // Create new product
  async createProduct(req, res) {
    try {
      const { name, description, price, category, stock, image, size } = req.body;

      // Validate required fields
      if (!name || !description || !price || !category || !stock || !image) {
        return res.status(400).json({ message: "Please enter all required data" });
      }

      // Verify the category exists
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
        size: sizeArray
      });

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
  }

  // Get all products
  async getAllProducts(req, res) {
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
  }

  // Get single product
  async getProductById(req, res) {
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
  }

  // Update product
  async updateProduct(req, res) {
    try {
      const { name, description, price, category, stock, image, size } = req.body;

      // Check if product exists
      const existingProduct = await Product.findById(req.params.id);
      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Verify category if provided
      if (category) {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
          return res.status(400).json({ message: "Invalid category ID" });
        }
      }

      // Convert size string to array if provided
      const sizeArray = size ? size.split(',').map(s => s.trim()) : existingProduct.size;

      const updateData = {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price }),
        ...(category && { category }),
        ...(stock && { stock }),
        ...(image && { image }),
        ...(size !== undefined && { size: sizeArray })
      };

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate('category');

      const likeCount = await Likes.countDocuments({ product: product._id });

      res.status(200).json({
        message: "Product updated successfully",
        product: { ...product.toObject(), likeCount }
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
  }

  // Delete product
  async deleteProduct(req, res) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
      console.error("Delete product error:", err);
      if (err.name === 'CastError') {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get products by category
  async getProductsByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const products = await Product.find({ category: categoryId }).populate('category');

      const productsWithLikes = await Promise.all(products.map(async (product) => {
        const likeCount = await Likes.countDocuments({ product: product._id });
        return { ...product.toObject(), likeCount };
      }));

      res.status(200).json(productsWithLikes);
    } catch (err) {
      console.error("Get products by category error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new ProductController();