import { ActionTypes } from "../constants/action-types";

// ---------- helpers ----------
const toAbsolute = (url) =>
  !url ? null : /^https?:\/\//i.test(url)
    ? url
    : `http://localhost:9191/${String(url).replace(/^\/+/, "")}`;

const newLineId = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

// Normalize any product into the cart line shape
const toCartLine = (p) => {
  const imgs = Array.isArray(p.imageUrls)
    ? p.imageUrls
    : Array.isArray(p.images)
    ? p.images
    : [];
  const imageUrls = imgs.map(toAbsolute).filter(Boolean);

  return {
    lineId: newLineId(),                                 // per-row identity
    productId: p.productId ?? p.id,
    title: p.productName ?? p.name ?? p.title ?? "Product",
    price: Number(p.price) || 0,
    quantity: 1,                                         // one row = one unit
    imageUrls,                                           // UI reads this
    category: p.categoryName ?? p.category?.name ?? "General",
  };
};

// ---------- actions ----------

// Add item as a NEW ROW (don’t merge)
export const addToCart = (product) => ({
  type: ActionTypes.ADD_TO_CART,
  payload: toCartLine(product),
});

// Decrease quantity for a specific row (by lineId)
export const decreaseQuantity = (lineId) => ({
  type: ActionTypes.DECREASE_QUANTITY,
  payload: { lineId },
});

// Delete a specific row (by lineId)
export const deleteFromCart = (lineId) => ({
  type: ActionTypes.DELETE_FROM_CART,
  payload: { lineId },
});

export const emptyCart = () => ({ type: ActionTypes.EMPTY_CART });

export const getTotalCartAmount = () => ({ type: ActionTypes.GET_TOTAL_CART_AMOUNT });

export const saveForLater = (item) => ({
  type: ActionTypes.SAVE_FOR_LATER,
  payload: item,
});

export const moveToCart = (item) => ({
  type: ActionTypes.MOVE_TO_CART,
  payload: item,
});

// Accept either product id or lineId (UI can pass what it has)
export const deleteFromSaved = (idOrLineId) => ({
  type: ActionTypes.DELETE_FROM_SAVED,
  payload: idOrLineId,
});
