import express from "express";
import {
  addProduct,
  allProducts,
  findProduct,
  removeProduct,
  updateProduct,
} from "./store.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

function readProductBody(body) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const price = Number(body.price);
  if (!name) {
    return { error: "Product name is required." };
  }
  if (!Number.isFinite(price) || price < 0) {
    return { error: "Price must be a number that is 0 or more." };
  }
  return { name, price };
}

app.get("/products", (req, res) => {
  res.json(allProducts());
});

app.get("/products/:id", (req, res) => {
  const product = findProduct(Number(req.params.id));
  if (!product) {
    return res.status(404).json({ error: "Product not found." });
  }
  res.json(product);
});

app.post("/products", (req, res) => {
  const parsed = readProductBody(req.body || {});
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }
  res.status(201).json(addProduct(parsed.name, parsed.price));
});

app.put("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!findProduct(id)) {
    return res.status(404).json({ error: "Product not found." });
  }
  const parsed = readProductBody(req.body || {});
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }
  res.json(updateProduct(id, parsed));
});

app.delete("/products/:id", (req, res) => {
  const removed = removeProduct(Number(req.params.id));
  if (!removed) {
    return res.status(404).json({ error: "Product not found." });
  }
  res.json({ message: "Product deleted." });
});

app.listen(port, () => {
  console.log(`Product API is up at http://localhost:${port}`);
});
