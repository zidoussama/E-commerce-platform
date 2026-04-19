
// routes/dashboard.js
const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');
const User = require('../../models/User');
const Product = require('../../models/product');
const Comment = require('../../models/Comment');
const Likes = require('../../models/likes');
const mongoose = require('mongoose');

// Middleware to verify admin access
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

// Dashboard stats route
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const now = new Date();

    // Helper function to get date ranges
    const getDateRange = (type) => {
      const start = new Date();
      switch (type) {
        case 'daily':
          start.setHours(0, 0, 0, 0);
          break;
        case 'weekly':
          start.setDate(now.getDate() - now.getDay());
          start.setHours(0, 0, 0, 0);
          break;
        case 'monthly':
          start.setMonth(now.getMonth(), 1);
          start.setHours(0, 0, 0, 0);
          break;
      }
      return start;
    };

    // 1. Total Sales (daily, weekly, monthly)
    const salesData = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: getDateRange('daily') }, status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: getDateRange('weekly') }, status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: getDateRange('monthly') }, status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);

    const totalSales = {
      daily: salesData[0][0]?.total || 0,
      weekly: salesData[1][0]?.total || 0,
      monthly: salesData[2][0]?.total || 0
    };

    // 2. Total Orders
    const totalOrders = await Order.countDocuments({ status: { $ne: 'Cancelled' } });

    // 3. Total Customers
    const totalCustomers = await User.countDocuments({ role: 'user' });

    // 4. Total Products (from the image)
    const totalProducts = await Product.countDocuments();

    // 5. Total Comments (from the image)
    const totalComments = await Comment.countDocuments();

    // 6. Total Likes (from the image)
    const totalLikes = await Likes.countDocuments();

    // 7. Engagement by Type (Likes and Comments per product)
    const engagementByType = await Promise.all([
      // Likes per product
      Likes.aggregate([
        { $group: { _id: '$product', count: { $sum: 1 } } },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $project: {
            productName: '$product.name',
            likes: '$count'
          }
        },
        { $sort: { likes: -1 } },
        { $limit: 5 }
      ]),
      // Comments per product
      Comment.aggregate([
        { $group: { _id: '$productId', count: { $sum: 1 } } },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $project: {
            productName: '$product.name',
            comments: '$count'
          }
        },
        { $sort: { comments: -1 } },
        { $limit: 5 }
      ])
    ]);

    // 8. Total Income Over Time (per month, last 12 months)
    const incomeOverTime = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(now.setMonth(now.getMonth() - 12)) },
          status: { $ne: 'Cancelled' }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' }
          },
          total: { $sum: '$total' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // 9. Revenue Graph Data (last 30 days for daily trend)
    const revenueGraph = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(now.setDate(now.getDate() - 30)) },
          status: { $ne: 'Cancelled' }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          total: { $sum: '$total' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // 10. Sales Conversion Rate (placeholder - requires visit tracking)
    const conversionRate = 'N/A';

    // 11. Top-selling Products (top 5)
    const topProducts = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          totalSold: 1,
          revenue: 1
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    // 12. Inventory Warnings (products with stock <= 10)
    const lowStock = await Product.find({ stock: { $lte: 10 } })
      .select('name stock')
      .limit(10);

    res.json({
      success: true,
      data: {
        totalSales,
        totalOrders,
        totalCustomers,
        totalProducts,
        totalComments,
        totalLikes,
        engagementByType: {
          likes: engagementByType[0],
          comments: engagementByType[1]
        },
        incomeOverTime,
        revenueGraph,
        conversionRate,
        topProducts,
        lowStock
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;