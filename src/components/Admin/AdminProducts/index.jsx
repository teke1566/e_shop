import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../../Navbar";
import { showToast } from "../../../utils/ToastService";
import api from "../../../services/api";
import ProductAdminForm from "../ProductAdminForm";

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/products");
      let data = Array.isArray(res.data) ? res.data : res.data?.content || [];

      // Normalize data fields to make frontend display consistent
      data = data.map((p) => ({
        id: p.id,
        title: p.title || p.name || p.productName || "-",
        description: p.description || p.desc || "",
        price: p.price ?? 0,
        imageUrl:
          p.imageUrl ||
          (Array.isArray(p.imageUrls) && p.imageUrls[0]) ||
          (Array.isArray(p.images) && p.images[0]) ||
          "/images/placeholder.png",
        stock: p.stock ?? p.quantity ?? 0,
        category:
          typeof p.category === "string"
            ? p.category
            : p.category?.name || p.categoryName || "-",
      }));

      console.log(" Normalized Products:", data);
      setItems(data);
    } catch (e) {
      console.error(e);
      showToast("Failed to load products", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return items;
    const s = q.toLowerCase();
    return items.filter(
      (p) =>
        String(p.title || "").toLowerCase().includes(s) ||
        String(p.category || "").toLowerCase().includes(s) ||
        String(p.id || "").includes(s)
    );
  }, [items, q]);

  const onCreate = () => {
    setEditing(null);
    setShowForm(true);
  };
  const onEdit = (p) => {
    setEditing(p);
    setShowForm(true);
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/api/products/${id}`);
      setItems((xs) => xs.filter((x) => x.id !== id));
      showToast("Product deleted", "success");
    } catch (e) {
      console.error(e);
      showToast("Delete failed", "danger");
    }
  };

  const onSave = async (payload) => {
    setSaving(true);
    try {
      if (payload.id) {
        const res = await api.put(`/api/products/${payload.id}`, payload);
        setItems((xs) => xs.map((x) => (x.id === payload.id ? res.data : x)));
        showToast("Product updated", "success");
      } else {
        const res = await api.post("/api/products", payload);
        setItems((xs) => [res.data, ...xs]);
        showToast("Product created", "success");
      }
      setShowForm(false);
      setEditing(null);
    } catch (e) {
      console.error(e);
      const msg = e?.response?.data?.message || "Save failed";
      showToast(msg, "danger");
    } finally {
      setSaving(false);
    }
  };

  const resolveImage = (p) =>
    p.imageUrl ||
    (Array.isArray(p.imageUrls) && p.imageUrls[0]) ||
    (Array.isArray(p.images) && p.images[0]) ||
    "/images/placeholder.png";

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Admin · Products</h3>
          <div className="d-flex gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title/category/id"
              className="form-control"
              style={{ width: 280 }}
            />
            <button className="btn btn-primary" onClick={onCreate}>
              + New Product
            </button>
          </div>
        </div>

        {showForm && (
          <div className="card mb-4">
            <div className="card-header fw-semibold">
              {editing ? `Edit #${editing.id}` : "Create Product"}
            </div>
            <div className="card-body">
              <ProductAdminForm
                initial={editing}
                onCancel={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                onSave={onSave}
                saving={saving}
              />
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-body p-0">
            {loading ? (
              <div className="p-4 text-muted">Loading…</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: 80 }}>ID</th>
                      <th style={{ width: 80 }}>Image</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th className="text-end" style={{ width: 120 }}>
                        Price
                      </th>
                      <th className="text-end" style={{ width: 100 }}>
                        Stock
                      </th>
                      <th style={{ width: 160 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>
                          <img
                            src={resolveImage(p)}
                            alt={p.title}
                            width="48"
                            height="48"
                            style={{ objectFit: "cover", borderRadius: 8 }}
                            onError={(e) =>
                              (e.currentTarget.src = "/images/placeholder.png")
                            }
                          />
                        </td>
                        <td className="fw-semibold">{p.title}</td>
                        <td className="text-muted small text-wrap" style={{ maxWidth: 200 }}>
                          {p.description || "-"}
                        </td>
                        <td>{p.category || "-"}</td>
                        <td className="text-end">
                          ${Number(p.price || 0).toFixed(2)}
                        </td>
                        <td className="text-end">{p.stock ?? 0}</td>
                        <td className="text-end">
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => onEdit(p)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => onDelete(p.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-4 text-center text-muted">
                          No products found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
