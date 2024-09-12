const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res, next) => {
	const { username, password } = req.body;
	const hashPassword = await bcrypt.hash(password, 12);

	try {
		const user = await User.create({
			username,
			password: hashPassword,
		});

		res.status(201).json({
			status: "success",
			data: user,
		});
	} catch (error) {
		res.status(400).json({
			status: "error",
			message: error.message,
		});
	}
};

// login
exports.login = async (req, res, next) => {
	const { username, password } = req.body;
	req.session.username = username;

	if (!username || !password) {
		return res.status(400).json({
			status: "error",
			message: "Please provide username and password",
		});
	}

	const user = await User.findOne({ username });

	if (!user) {
		return res.status(401).json({
			status: "error",
			message: "user not found",
		});
	}

	const isPasswordCorrect = await bcrypt.compare(password, user.password);
	if (isPasswordCorrect) {
		res.status(200).json({
			status: "success",
			data: user,
		});
	} else {
		return res.status(401).json({
			status: "error",
			message: "Incorrect username or password",
		});
	}
};
