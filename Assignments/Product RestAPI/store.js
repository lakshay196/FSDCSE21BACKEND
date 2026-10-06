const products = [
  { id: 1, name: "Desk lamp", price: 899 },
  { id: 2, name: "Backpack", price: 1499 },
  { id: 3, name: "USB charger", price: 499 },
];

let nextId = 4;

export function allProducts() {
  return products.map((item) => ({ ...item }));
}

export function findProduct(id) {
  return products.find((item) => item.id === id) || null;
}

export function addProduct(name, price) {
  const product = { id: nextId, name, price };
  nextId += 1;
  products.push(product);
  return { ...product };
}

export function updateProduct(id, changes) {
  const product = findProduct(id);
  if (!product) {
    return null;
  }
  if (changes.name !== undefined) {
    product.name = changes.name;
  }
  if (changes.price !== undefined) {
    product.price = changes.price;
  }
  return { ...product };
}

export function removeProduct(id) {
  const index = products.findIndex((item) => item.id === id);
  if (index === -1) {
    return false;
  }
  products.splice(index, 1);
  return true;
}
