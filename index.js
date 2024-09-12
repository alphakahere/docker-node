const express = require("express");
const mongoose = require("mongoose");
const {
	MONGO_USER,
	MONGO_PASSWORD,
	MONGO_IP,
	MONGO_PORT,
	PORT,
} = require("./config/config");

const postRouter = require("./routes/postRoute");

const app = express();

const port = PORT;
const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
	mongoose
		.connect(mongoUrl)
		.then(() => console.log("Successfully connected to DB"))
		.catch((err) => {
			console.log(err);
			setTimeout(connectWithRetry, 5000);
		});
};

connectWithRetry();

app.get("/", (req, res) => {
	res.send("<h1>Hello World !</h1>");
});
app.use(express.json());
app.use("/api/v1/posts", postRouter);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
