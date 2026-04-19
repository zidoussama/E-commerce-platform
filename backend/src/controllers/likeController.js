const Likes = require('../models/likes');
const Product = require('../models/product');
const User = require('../models/User');

class LikeController {
  // Add a like for a product by a user
  async addLike(req, res) {
    try {
      const { userId, productId } = req.body;

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

      // Check if the user has already liked the product
      const existingLike = await Likes.findOne({ user: userId, product: productId });
      if (existingLike) {
        return res.status(400).json({ message: "User has already liked this product" });
      }

      const newLike = new Likes({
        user: userId,
        product: productId
      });

      const like = await newLike.save();
      const populatedLike = await Likes.findById(like._id).populate('user').populate('product');
      res.status(201).json({
        message: "Product liked successfully",
        like: populatedLike
      });
    } catch (err) {
      console.error("Add like error:", err);
      if (err.code === 11000) {
        return res.status(400).json({ message: "User has already liked this product" });
      }
      if (err.name === 'CastError') {
        return res.status(400).json({ message: "Invalid user ID or product ID" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Remove a like for a product by a user
  async removeLike(req, res) {
    try {
      const { userId, productId } = req.body;

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

      // Find and remove the like
      const like = await Likes.findOneAndDelete({ user: userId, product: productId });
      if (!like) {
        return res.status(404).json({ message: "Like not found" });
      }

      res.status(200).json({ message: "Like removed successfully" });
    } catch (err) {
      console.error("Remove like error:", err);
      if (err.name === 'CastError') {
        return res.status(400).json({ message: "Invalid user ID or product ID" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get all likes (optionally filter by userId or productId)
  async getLikes(req, res) {
    try {
      const { userId, productId } = req.query;

      let query = {};
      if (userId) query.user = userId;
      if (productId) query.product = productId;

      const likes = await Likes.find(query).populate('user').populate('product');
      res.status(200).json(likes);
    } catch (err) {
      console.error("Get likes error:", err);
      if (err.name === 'CastError') {
        return res.status(400).json({ message: "Invalid user ID or product ID" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get the number of likes for each product
  async getLikeCounts(req, res) {
    try {
      const likeCounts = await Likes.aggregate([
        {
          $group: {
            _id: "$product",
            count: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product"
          }
        },
        {
          $unwind: "$product"
        },
        {
          $project: {
            productId: "$_id",
            productName: "$product.name",
            count: 1
          }
        }
      ]);

      res.status(200).json(likeCounts);
    } catch (err) {
      console.error("Get like counts error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get all products that have at least one like, along with the users who liked them
  async getLikedProducts(req, res) {
    try {
      const likedProducts = await Likes.aggregate([
        {
          $group: {
            _id: "$product",
            likedBy: { $push: "$user" }
          }
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product"
          }
        },
        {
          $unwind: "$product"
        },
        {
          $lookup: {
            from: "users",
            localField: "likedBy",
            foreignField: "_id",
            as: "likedByUsers"
          }
        },
        {
          $project: {
            product: {
              _id: "$product._id",
              name: "$product.name",
              price: "$product.price",
              image: "$product.image"
            },
            likedBy: "$likedByUsers"
          }
        }
      ]);

      res.status(200).json(likedProducts);
    } catch (err) {
      console.error("Get liked products error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new LikeController();