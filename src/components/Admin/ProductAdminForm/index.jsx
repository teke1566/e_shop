import React, { useEffect, useState } from "react";

const EMPTY = {
  id: null,
  title: "",
  description: "",
  price: "",
  category: "",
  imageUrl: "",
  stock: "",
};

export default function ProductAdminForm({ initial, onCancel, onSave, saving }) {
  const [model, setModel] = useState(EMPTY);

  useEffect(() => {
    setModel({ ...EMPTY, ...(initial || {}) });
  }, [initial]);

  const onChange = (e) =>
    setModel((m) => ({ ...m, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    onSave({
      ...model,
      price: Number(model.price || 0),
      stock: Number(model.stock || 0),
    });
  };

  return (
    <form onSubmit={submit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Title</label>
          <input
            name="title"
            value={model.title}
            onChange={onChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Category</label>
          <input
            name="category"
            value={model.category}
            onChange={onChange}
            className="form-control"
          />
        </div>
        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={model.description}
            onChange={onChange}
            className="form-control"
            rows={3}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Price</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={model.price}
            onChange={onChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Stock</label>
          <input
            type="number"
            name="stock"
            value={model.stock}
            onChange={onChange}
            className="form-control"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Image URL</label>
          <input
            name="imageUrl"
            value={model.imageUrl}
            onChange={onChange}
            className="form-control"
          />
        </div>
      </div>

      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
        <button className="btn btn-outline-secondary" type="button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  );
}
