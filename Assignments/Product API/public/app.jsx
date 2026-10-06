const { useEffect, useState } = React;

function App() {
  const emptyForm = { name: "", price: "", stock: "" };
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    const response = await fetch("/api/products");
    setProducts(await response.json());
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const onChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const payload = {
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
    };
    const response = await fetch(
      editingId ? `/api/products/${editingId}` : "/api/products",
      {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Could not save the product.");
      return;
    }
    setForm(emptyForm);
    setEditingId(null);
    loadProducts();
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: String(product.price),
      stock: String(product.stock),
    });
  };

  const remove = async (id) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
    loadProducts();
  };

  return (
    <main>
      <h1>Product manager</h1>
      <form onSubmit={onSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={onChange} required />
        <input name="price" type="number" min="0" placeholder="Price" value={form.price} onChange={onChange} required />
        <input name="stock" type="number" min="0" step="1" placeholder="Stock" value={form.stock} onChange={onChange} required />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
            }}
          >
            Cancel
          </button>
        )}
      </form>
      {error && <p className="error">{error}</p>}
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <span>
              {product.name} — Rs {product.price} — stock {product.stock}
            </span>
            <span>
              <button type="button" onClick={() => startEdit(product)}>Edit</button>
              <button type="button" onClick={() => remove(product.id)}>Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
