if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
  if (!process.env.NODE_ENV) {
    console.log("Please, initialize your environment (.env).");
  }
}

const app = require("./app");
const port = process.env.PORT || 3005;
console.log(`Server listening on port ${port}`);

app.listen(port);
