import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = Number(process.env.PORT) || 3000;
const folder = path.dirname(fileURLToPath(import.meta.url));

const routes = {
  "/": "home.html",
  "/about": "about.html",
};

app.get(Object.keys(routes), async (req, res) => {
  const fileName = routes[req.path];
  try {
    const html = await fs.readFile(path.join(folder, fileName), "utf8");
    res.type("html").send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("That page could not be loaded.");
  }
});

app.listen(port, () => {
  console.log(`Pages server is up at http://localhost:${port}`);
});
