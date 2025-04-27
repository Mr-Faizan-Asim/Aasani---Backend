require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes    = require("./routes/userRoutes");

const chatRoutes    = require("./routes/chatRoutes");
//const { errorHandler } = require("./middleware/error");

const app = express();

// JSON body parser
app.use(express.json());

// CORS: allow frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
  })
);

// Mount routes
app.use("/api/users",    userRoutes);
app.use('/api/provider', require('./routes/providerRoutes.js'));
app.use('/api/chats', chatRoutes);
app.use('/api/chat', require('./routes/chatRoutes.js'));
app.use('api/guests', require('./routes/guestRoutes.js'));
// Global error handler (centralized)
//app.use(errorHandler);

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("Mongo connection error:", err));
