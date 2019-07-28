const mongoose = require('mongoose');
const Schema = mongoose.Schema


const UserSchema = new mongoose.Schema({
	  email: {
	    type: String,
	    unique: true,
	    required: true,
	    trim: true
	  },
	  username: {
	    type: String,
	    unique: true,
	    required: true,
	    trim: true
	  },
	  password: {
	    type: String,
	    required: true,
	  },
	  passwordResetToken: String,
	  passwordResetExpires: Date,
	  isVerified: { type: Boolean, default: false }
});




module.exports = mongoose.model('User',UserSchema);
