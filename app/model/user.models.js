const mongoose = require('mongoose');
const Schema = mongoose.Schema


const UserSchema = new mongoose.Schema({
	  email: {
	    type: String,
	    unique: true,
	    required: true,
	    trim: true
	  },
	  password: {
	    type: String,
	    required: true,
	  },
	  first_name: {
		type: String,
		required: true,
		trim: true
	  },
	  last_name: {
	    type: String,
		required: true,
		trim: true
	  },
	  passwordResetToken: String,
	  passwordResetExpires: Date,
	  isVerified: { type: Boolean, default: false }
});




module.exports = mongoose.model('User',UserSchema);
