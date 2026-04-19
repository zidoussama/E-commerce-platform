const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");

// Load routes
const users = require("./routes/api/users"); 
const products = require("./routes/api/product");
const categories = require("./routes/api/categoryRoutes");
const likes = require("./routes/api/likes"); // Assuming you have a likes route
const comment = require("./routes/api/comments"); // Assuming you have a comments route
const userinfoRoutes = require('./routes/api/userinfo');
const cartRoutes = require('./routes/api/cart'); // Assuming you have a cart route
const ordersRoutes = require('./routes/api/orders'); // Assuming you have an orders route
const Deals = require('./routes/api/deals'); // Assuming you have a deals route
const googleRoutes = require('./routes/api/googleRoute'); // Assuming you have a google route
const dashboard =require('./routes/api/dashboard'); // Assuming you have a dashboard route

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Added OPTIONS for preflight requests
  allowedHeaders: ['Content-Type', 'Authorization'], // Added Authorization header
  credentials: true
}));
app.use(express.json({ limit: '500mb' }));

// MongoDB Connection
const mongo_url = config.get("mongo_url");
mongoose.set("strictQuery", true);
mongoose
  .connect(mongo_url)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/users", users);
app.use("/api/products", products);
app.use("/api/categories", categories);
app.use("/api/likes", likes); // Assuming you have a likes route
app.use("/api/comments", comment); // Assuming you have a comments route
app.use("/api/userinfo", userinfoRoutes); // User info route
app.use("/api/cart", cartRoutes); // Cart route
app.use("/api/orders", ordersRoutes); // Orders route
app.use("/api/deals", Deals); // Deals route
app.use("/api/users/google-login", googleRoutes); // Google login route
app.use("/api/dashboard", dashboard); // Dashboard route

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});



const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));