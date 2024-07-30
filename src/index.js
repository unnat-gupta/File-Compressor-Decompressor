import dotenv from "dotenv";
import colors from "colors";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

app.listen(process.env.PORT, () => {
  console.log(
    `Server is up and running on port ${process.env.PORT}`.bgBlue.white,
  );
});
