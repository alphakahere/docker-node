const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
const cors = require("cors");

const {
	MONGO_USER,
	MONGO_PASSWORD,
	MONGO_IP,
	MONGO_PORT,
	PORT,
	REDIS_URL,
	REDIS_PORT,
	SESSION_SECRET,
} = require("./config/config");

let redisStore = require("connect-redis").default;
let redisClient = redis.createClient({
	url: `redis://${REDIS_URL}:${REDIS_PORT}`,
});

redisClient
	.connect(console.log("Redis connected successfuly"))
	.catch(console.error);

const postRouter = require("./routes/postRoute");
const userRouter = require("./routes/userRoute");

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

app.use(cors());

app.get("/api/v1/", (req, res) => {
	res.send("<h1>Hello World !</h1>");
});

app.enable("trust proxy");
app.use(
	session({
		store: new redisStore({ client: redisClient }),
		secret: SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false, // Assure-toi que cela est correct pour ton environnement
			httpOnly: true,
			maxAge: 60000,
		},
	})
);

app.use(express.json());
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);


app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
