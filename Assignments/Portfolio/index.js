const express = require("express");
const path = require("path");

const app = express();
const port = Number(process.env.PORT) || 3001;
const root = __dirname;

app.use(express.static(root));

app.get("/", (req, res) => {
  res.sendFile(path.join(root, "index.html"));
});

app.listen(port, () => {
  console.log(`Portfolio is up at http://localhost:${port}`);
});
