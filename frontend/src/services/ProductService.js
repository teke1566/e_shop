import api from "./api";

const ProductService = {
  getAll: () => api.get("/api/products"),
  getById: (id) => api.get(`/api/products/${id}`),
  addProductWithImages: (formData) =>
    api.post("/api/products/add-with-images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default ProductService;
