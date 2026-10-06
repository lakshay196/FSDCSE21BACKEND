const express = require("express");
const path = require("path");

const app = express();
const port = Number(process.env.PORT) || 3002;

let products = [
  { id: 1, name: "Notebook", price: 120, stock: 30 },
  { id: 2, name: "Pen set", price: 80, stock: 50 },
];
let nextId = 3;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readItem(body) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const price = Number(body.price);
  const stock = Number(body.stock);
  if (!name) {
    return { error: "Name is required." };
  }
  if (!Number.isFinite(price) || price < 0) {
    return { error: "Price must be 0 or more." };
  }
  if (!Number.isInteger(stock) || stock < 0) {
    return { error: "Stock must be a whole number, 0 or more." };
  }
  return { name, price, stock };
}

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.post("/api/products", (req, res) => {
  const parsed = readItem(req.body || {});
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }
  const product = { id: nextId, ...parsed };
  nextId += 1;
  products.push(product);
  res.status(201).json(product);
});

app.put("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((item) => item.id === id);
  if (!product) {
    return res.status(404).json({ error: "Product not found." });
  }
  const parsed = readItem(req.body || {});
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }
  Object.assign(product, parsed);
  res.json(product);
});

app.delete("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Product not found." });
  }
  products.splice(index, 1);
  res.json({ message: "Product deleted." });
});

app.listen(port, () => {
  console.log(`Product manager is up at http://localhost:${port}`);
});
