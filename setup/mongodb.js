const mongoose = require("mongoose"); // Import mongoose

const uri = "mongodb://localhost:27017/Stack"; // Database url in mongodb



mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true }); // Make connection to mongodb penjualan_dev database
mongoose.set('useFindAndModify', false);

const User = require("../models/user"); // Import user model
// const movies = require("./movies"); // Import user model
// const review = require("./review"); // Import user model
// const pelanggan = require("./pelanggan"); // Import pelanggan model
// const pemasok = require("./pemasok"); // Import pemasok model
// const transaksi = require("./transaksi"); // Import transaksi model

module.exports = { User, secret: 'mystrongsecret' }; // Exports all models
