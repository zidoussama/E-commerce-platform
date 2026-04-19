const Cart = require('../models/Cart');
const Product = require('../models/product');
const User = require('../models/User');

class CartController {
  // Get cart for user
  async getCart(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Verify the user exists
      const userExists = await User.findById(userId);
      if (!userExists) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Find or create a cart for the user
      let cart = await Cart.findOne({ user: userId }).populate('items.product');
      if (!cart) {
        cart = new Cart({ user: userId, items: [] });
        await cart.save();
      }

      res.status(200).json(cart);
    } catch (err) {
      console.error("Get cart error:", err);
      if (err.name === 'CastError') {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Add product to cart
  async addToCart(req, res) {
    try {
      const { userId, productId, quantity, size } = req.body;

      if (!userId || !productId) {
        return res.status(400).json({ message: "User ID and Product ID are required" });
      }

      if (quantity && (isNaN(quantity) || quantity < 1)) {
        return res.status(400).json({ message: "Quantity must be a positive number" });
      }

      // Verify the user exists
      const userExists = await User.findById(userId);
      if (!userExists) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Verify the product exists
      const productExists = await Product.findById(productId);
      if (!productExists) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      // Check stock availability
      if (productExists.stock < (quantity || 1)) {
        return res.status(400).json({ message: "Product is out of stock or insufficient stock" });
      }

      // Find or create a cart for the user
      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
        cart = new Cart({ user: userId, items: [] });
      }

      // Check if the product with the same size is already in the cart
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId && item.size === (size || null)
      );
      if (itemIndex > -1) {
        // Update quantity if the product with the same size is already in the cart
        cart.items[itemIndex].quantity += quantity || 1;
        if (cart.items[itemIndex].quantity > productExists.stock) {
          return res.status(400).json({ message: "Cannot add more items than available stock" });
        }
      } else {
        // Add new item to the cart with the specified size
        cart.items.push({ product: productId, quantity: quantity || 1, size: size || null });
      }

      await cart.save();
      const populatedCart = await Cart.findById(cart._id).populate('items.product');
      res.status(200).json({ message: "Product added to cart", cart: populatedCart });
    } catch (err) {
      console.error("Add to cart error:", err);
      if (err.name === 'CastError') {
        return res.status(400).json({ message: "Invalid user ID or product ID" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Update cart item quantity
  async updateCartItem(req, res) {
    try {
      const { userId, productId, quantity, size } = req.body;

      if (!userId || !productId) {
        return res.status(400).json({ message: "User ID and Product ID are required" });
      }

      if (isNaN(quantity) || quantity < 1) {
        return res.status(400).json({ message: "Quantity must be a positive number" });
      }

      // Verify the user exists
      const userExists = await User.findById(userId);
      if (!userExists) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Verify the product exists
      const productExists = await Product.findById(productId);
      if (!productExists) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      // Check stock availability
      if (productExists.stock < quantity) {
        return res.status(400).json({ message: "Insufficient stock for the requested quantity" });
      }

      // Find the cart
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Find the item in the cart with the matching productId and size
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId && item.size === (size || null)
      );
      if (itemIndex === -1) {
        return res.status(404).json({ message: "Product with this size not found in cart" });
      }

      // Update the quantity
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      const populatedCart = await Cart.findById(cart._id).populate('items.product');
      res.status(200).json({ message: "Cart updated successfully", cart: populatedCart });
    } catch (err) {
      console.error("Update cart error:", err);
      if (err.name === 'CastError') {
        return res.status(400).json({ message: "Invalid user ID or product ID" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Remove item from cart
  async removeFromCart(req, res) {
    try {
      const { userId, productId, size } = req.body;

      if (!userId || !productId) {
        return res.status(400).json({ message: "User ID and Product ID are required" });
      }

      // Verify the user exists
      const userExists = await User.findById(userId);
      if (!userExists) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Verify the product exists
      const productExists = await Product.findById(productId);
      if (!productExists) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      // Find the cart
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Remove the item from the cart matching both productId and size
      const initialLength = cart.items.length;
      cart.items = cart.items.filter(
        item => !(item.product.toString() === productId && item.size === (size || null))
      );
      if (cart.items.length === initialLength) {
        return res.status(404).json({ message: "Product with this size not found in cart" });
      }

      await cart.save();
      const populatedCart = await Cart.findById(cart._id).populate('items.product');
      res.status(200).json({ message: "Product removed from cart", cart: populatedCart });
    } catch (err) {
      console.error("Remove from cart error:", err);
      if (err.name === 'CastError') {
        return res.status(400).json({ message: "Invalid user ID or product ID" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Clear entire cart
  async clearCart(req, res) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Verify the user exists
      const userExists = await User.findById(userId);
      if (!userExists) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Find the cart
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Clear the cart
      cart.items = [];
      await cart.save();
      res.status(200).json({ message: "Cart cleared successfully", cart });
    } catch (err) {
      console.error("Clear cart error:", err);
      if (err.name === 'CastError') {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new CartController();