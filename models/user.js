var mongoose = require('../data/mongoose');
var crypto = require('crypto'); // модуль nodejs для шифрования 

var Schema = mongoose.Schema;

var userSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Укажите имя"]
		},
		username: {
			type: String,
			required: [true, "Поле обязательно для заполнения"]
		},
		email: {
			type: String,
			required: [true, "Поле обязательно для заполнения"]
		},
		hashedPassword: {     
			type: String,
			required: true
		},
		salt: {               
			type: String,
			required: true
		},
		created_at: { 
			type: Date,
			default: Date.now 
		}
	},
	{ 
		versionKey: false 
	}
);

// https://stackoverflow.com/questions/7480158/how-do-i-use-node-js-crypto-to-create-a-hmac-sha1-hash

userSchema.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha256', this.salt).update(password).digest('hex');
};

userSchema.virtual('password')
	.set(function(password) {
		this._plainPassword = password;
		this.salt = Math.random() + '';
		this.hashedPassword = this.encryptPassword(password);
	})
	.get(function() { return this._plainPassword; });


userSchema.methods.checkPassword = function(password) {
	console.log("checkPassword ", this.encryptPassword(password) === this.hashedPassword);
	return this.encryptPassword(password) === this.hashedPassword;
};

var User = mongoose.model('User', userSchema);


module.exports = User;

