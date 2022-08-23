require("./middlewares/connectToDB");
const express = require("express");
const app = express();
const productsRouter = require("./Routes/Products/productRouter");
const usersRouter = require("./Routes/Users/userRouter");
const chalk = require("chalk");
const morgan = require("morgan");
const cors = require("cors");

app.use(morgan(chalk.cyan(":method :url :status :response-time ms")));
app.use(cors());

app.use(express.json());
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);

const PORT = 8181;
app.listen(PORT, () =>
  console.log(chalk.blueBright.bold(`server run on: http://:localhost:${PORT}`))
);
