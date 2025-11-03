// redux/actions/search-actions.js
import api from "../../services/api"; // baseURL -> http://localhost:9191

let PRODUCT_CACHE = null;

/* ---------------- helpers ---------------- */
const toAbs = (u) => {
  if (!u) return null;
  if (/^https?:\/\//i.test(u)) return u;
  return `http://localhost:9191/${String(u).replace(/^\/+/, "")}`;
};

const first = (obj, keys) => {
  for (const k of keys) {
    const v = obj && obj[k];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
};

const collectImages = (p) => {
  // arrays
  let imgs = [];
  if (Array.isArray(p.images)) imgs = p.images;
  if (!imgs.length && Array.isArray(p.imageUrls)) imgs = p.imageUrls;
  if (!imgs.length && Array.isArray(p.productImages)) {
    imgs = p.productImages.map((pi) => first(pi, ["imageUrl", "image_url", "url"]));
  }
  // single url fields
  if (!imgs.length) {
    const one = first(p, ["imageUrl", "image_url", "image"]);
    if (one) imgs = [one];
  }
  return imgs.map(toAbs).filter(Boolean);
};

const normalize = (p) => {
  const title =
    first(p, ["title", "name", "productName", "product_name"]) ||
    "Unnamed Product";

  let categoryName =
    first(p, ["categoryName", "category_name", "category"]) || "";
  if (!categoryName && p.category && typeof p.category === "object") {
    categoryName = first(p.category, ["name", "title"]) || "";
  }

  return {
    id: first(p, ["id", "productId", "product_id"]),
    title,
    description: first(p, ["description", "desc"]) || "",
    price: Number(first(p, ["price", "unitPrice", "unit_price"])) || 0,
    images: collectImages(p),
    categoryName,
    quantity: Number(first(p, ["quantity", "qty"])) || 0,
  };
};

/* ---------------- data fetch (BACKEND ONLY) ---------------- */
const fetchAllProducts = async () => {
  // Your backend may return a plain array OR a Spring Page { content, ... }.
  const res = await api.get("/api/products");
  const raw = Array.isArray(res.data?.content)
    ? res.data.content
    : Array.isArray(res.data)
    ? res.data
    : [];

  return raw.map(normalize);
};

/* ---------------- public actions ---------------- */
export const searchProducts = (query = "", category = "All") => {
  return async (dispatch) => {
    dispatch({ type: "SEARCH_REQUEST" });

    try {
      if (!PRODUCT_CACHE) PRODUCT_CACHE = await fetchAllProducts();

      const q = (query || "").trim().toLowerCase();
      const c = (category || "").trim().toLowerCase();
      const isAll = c === "all" || c === "all departments";

      const filtered = PRODUCT_CACHE.filter((p) => {
        const name = (p.title || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        const cat = (p.categoryName || "").toLowerCase();
        const matchesQuery = !q || name.includes(q) || desc.includes(q);
        const matchesCategory = isAll || cat.includes(c);
        return matchesQuery && matchesCategory;
      });

      dispatch({ type: "SEARCH_SUCCESS", payload: filtered });
    } catch (err) {
      dispatch({
        type: "SEARCH_FAIL",
        payload:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load products from backend.",
      });
    }
  };
};

export const clearSearchResults = () => ({ type: "CLEAR_SEARCH_RESULTS" });
export const invalidateSearchCache = () => {
  PRODUCT_CACHE = null;
  return { type: "SEARCH_CACHE_INVALIDATED" };
};
