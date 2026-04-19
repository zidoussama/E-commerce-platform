const router = require("express").Router();
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/product");
const User = require("../../models/User");

// @route POST api/orders
// @desc Place a new order
// @access Public (No token or role check)
router.post("/", async (req, res) => {
  const { userId, deliveryMethod, paymentMethod, shippingAddress ,paypalOrderId,paymentStatus} = req.body;

  if (!userId || !deliveryMethod || !paymentMethod || !shippingAddress) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Verify the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Fetch the user's cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Verify stock for each item
    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({ message: `Insufficient stock for ${item.product.name}` });
      }
    }

    // Calculate total
    const total = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // Create the order
    const order = new Order({
      user: userId,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
        size: item.size || null, // Include size from cart (defaults to null if not present)
      })),
      total,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      paypalOrderId,
      paymentStatus,
    });

    // Update product stock
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      product.stock -= item.quantity;
      await product.save();
    }

    // Clear the cart
    cart.items = [];
    await cart.save();

    // Save the order
    await order.save();
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("Place order error:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: "Invalid user ID or product ID" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// @route GET api/orders
// @desc Get all orders for a user by userId
// @access Public (No token or role check)
router.get("/", async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const orders = await Order.find({ user: userId })
      .populate('items.product')
      .sort({ createdAt: -1 }); // Sort by most recent first
    res.status(200).json(orders); // Size field will be included automatically
  } catch (err) {
    console.error("Get orders error:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// @route GET api/orders/all
// @desc Get all orders
// @access Public (No token or role check)
router.get("/all", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.product')
      .populate('user', 'firstname lastname email')
      .sort({ createdAt: -1 }); // Sort by most recent first
    res.status(200).json(orders); // Size field will be included automatically
  } catch (err) {
    console.error("Get all orders error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @route PUT api/orders/:id
// @desc Update an order by ID (e.g., change status)
// @access Public (No token or role check)
router.put("/:id", async (req, res) => {
  const orderId = req.params.id;
  const { status, deliveryMethod, paymentMethod, shippingAddress, items ,paypalOrderId,paymentStatus} = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update fields if provided
    if (status) order.status = status;
    if (deliveryMethod) order.deliveryMethod = deliveryMethod;
    if (paymentMethod) order.paymentMethod = paymentMethod;
    if (shippingAddress) order.shippingAddress = shippingAddress;
    if (paymentStatus) order.paymentStatus=paymentStatus;
    if (paypalOrderId) order.paypalOrderId=paypalOrderId;

    // Update items if provided (including size)
    if (items && Array.isArray(items)) {
      order.items = items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        size: item.size || null, // Update size (defaults to null if not provided)
      }));
    }

    await order.save();
    res.status(200).json({ message: "Order updated successfully", order });
  } catch (err) {
    console.error("Update order error:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// @route DELETE api/orders/:id
// @desc Delete an order by ID
// @access Public (No token or role check)
router.delete("/:id", async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.deleteOne();
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Delete order error:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;