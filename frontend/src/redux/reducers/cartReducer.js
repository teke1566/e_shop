// src/redux/reducers/cart-reducer.js
import { ActionTypes } from "../constants/action-types";

/* ---------- tiny utilities ---------- */

const sameRow = (row, key) =>
  key != null &&
  (
    (row.lineId != null && String(row.lineId) === String(key)) ||
    (row.productId != null && String(row.productId) === String(key)) ||
    (row.id != null && String(row.id) === String(key))
  );

const getKey = (payload) =>
  payload?.key ?? payload?.lineId ?? payload?.id ?? payload?.productId;

const idFallback = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

const toAbs = (url) =>
  !url
    ? null
    : /^https?:\/\//i.test(url)
    ? url
    : `http://localhost:9191/${String(url).replace(/^\/+/, "")}`;

const normalizeImages = (imgs) =>
  (Array.isArray(imgs) ? imgs : []).map(toAbs).filter(Boolean);

const recompute = (list) =>
  list.reduce(
    (acc, it) => {
      const q = Number(it.quantity) || 0;
      const p = Number(it.price) || 0;
      acc.qty += q;
      acc.total += q * p;
      return acc;
    },
    { qty: 0, total: 0 }
  );

/* ---------- normalization / merge helpers ---------- */

const normalizeIncoming = (row) => ({
  ...row,
  // make sure we always carry a productId (caller should send it, but we guard)
  productId: row.productId ?? row.id,
  imageUrls: normalizeImages(row.imageUrls || row.images || [row.imageUrl]),
  lineId: row.lineId || idFallback(),
  quantity: Number(row.quantity) || 1,
  price: Number(row.price) || Number(row.unitPrice) || 0,
});

const mergeIntoCarts = (carts, incoming) => {
  const idx = carts.findIndex(
    (it) => String(it.productId) === String(incoming.productId)
  );
  if (idx !== -1) {
    // Same product → bump quantity; refresh details where provided
    return carts.map((it, i) =>
      i === idx
        ? {
            ...it,
            quantity: (Number(it.quantity) || 1) + (Number(incoming.quantity) || 1),
            title: incoming.title ?? incoming.productName ?? it.title,
            productName: incoming.productName ?? it.productName,
            price: incoming.price || it.price,
            imageUrls:
              incoming.imageUrls && incoming.imageUrls.length
                ? incoming.imageUrls
                : it.imageUrls,
            category: incoming.category ?? it.category,
            categoryName: incoming.categoryName ?? it.categoryName,
          }
        : it
    );
  }
  // New product → new row
  return [...carts, incoming];
};

/* ---------- localStorage migration/persist ---------- */

const migrate = (raw) => {
  try {
    const data = raw && typeof raw === "object" ? raw : {};
    const carts = Array.isArray(data.carts)
      ? data.carts.map((i) => ({
          ...i,
          productId: i.productId ?? i.id,
          lineId: i.lineId || idFallback(),
          imageUrls: normalizeImages(i.imageUrls || i.images),
          quantity: Number(i.quantity) || 1,
          price: Number(i.price) || 0,
        }))
      : [];
    const savedItems = Array.isArray(data.savedItems)
      ? data.savedItems.map((i) => ({
          ...i,
          productId: i.productId ?? i.id,
          lineId: i.lineId || idFallback(),
          imageUrls: normalizeImages(i.imageUrls || i.images || [i.imageUrl]),
          quantity: Number(i.quantity) || 1,
          price: Number(i.price) || 0,
        }))
      : [];
    const t = recompute(carts);
    return {
      cartItemNumbers: t.qty,
      cartTotalQuantity: t.qty,
      cartTotalAmount: Number(t.total.toFixed(2)),
      carts,
      savedItems,
    };
  } catch {
    return {
      cartItemNumbers: 0,
      cartTotalQuantity: 0,
      cartTotalAmount: 0,
      carts: [],
      savedItems: [],
    };
  }
};

const persist = (state) =>
  localStorage.setItem("eshop_cart", JSON.stringify(state));

const localData = JSON.parse(localStorage.getItem("eshop_cart") || "null");
const initialState = migrate(localData);

/* ---------- reducer ---------- */

export const cartReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.GET_CART_ITEMS_NUMBERS:
      return { ...state };

    // ADD (merge by productId)
    case ActionTypes.ADD_TO_CART: {
      const incoming = normalizeIncoming(payload);
      const updatedCarts = mergeIntoCarts(state.carts, incoming);

      const t = recompute(updatedCarts);
      const newState = {
        ...state,
        carts: updatedCarts,
        cartItemNumbers: t.qty,
        cartTotalAmount: Number(t.total.toFixed(2)),
        cartTotalQuantity: t.qty,
      };
      persist(newState);
      return newState;
    }

    // DELETE (accept payload.key/lineId/productId/id)
    case ActionTypes.DELETE_FROM_CART: {
      const key = getKey(payload);
      const updatedCarts = state.carts.filter((it) => !sameRow(it, key));
      const t = recompute(updatedCarts);
      const newState = {
        ...state,
        carts: updatedCarts,
        cartItemNumbers: t.qty,
        cartTotalAmount: Number(t.total.toFixed(2)),
        cartTotalQuantity: t.qty,
      };
      persist(newState);
      return newState;
    }

    // DECREASE (auto-remove when quantity hits 0)
    case ActionTypes.DECREASE_QUANTITY: {
      const key = getKey(payload);
      const updatedCarts = state.carts
        .map((it) =>
          sameRow(it, key)
            ? { ...it, quantity: Math.max((Number(it.quantity) || 1) - 1, 0) }
            : it
        )
        .filter((it) => (Number(it.quantity) || 0) > 0);

      const t = recompute(updatedCarts);
      const newState = {
        ...state,
        carts: updatedCarts,
        cartItemNumbers: t.qty,
        cartTotalAmount: Number(t.total.toFixed(2)),
        cartTotalQuantity: t.qty,
      };
      persist(newState);
      return newState;
    }

    // SAVE FOR LATER (merge by productId in saved list)
    case ActionTypes.SAVE_FOR_LATER: {
      const item = normalizeIncoming(payload);

      // remove from cart by lineId
      const updatedCarts = state.carts.filter((c) => c.lineId !== item.lineId);

      // merge into saved by productId
      const sIdx = state.savedItems.findIndex(
        (s) => String(s.productId) === String(item.productId)
      );
      const updatedSaved =
        sIdx !== -1
          ? state.savedItems.map((s, i) =>
              i === sIdx
                ? {
                    ...s,
                    quantity: (Number(s.quantity) || 1) + (Number(item.quantity) || 1),
                    imageUrls: s.imageUrls?.length ? s.imageUrls : item.imageUrls,
                  }
                : s
            )
          : [...state.savedItems, item];

      const t = recompute(updatedCarts);
      const newState = {
        ...state,
        carts: updatedCarts,
        savedItems: updatedSaved,
        cartItemNumbers: t.qty,
        cartTotalAmount: Number(t.total.toFixed(2)),
        cartTotalQuantity: t.qty,
      };
      persist(newState);
      return newState;
    }

    // MOVE TO CART (MERGE by productId; remove from saved)
    case ActionTypes.MOVE_TO_CART: {
      const fromSaved = normalizeIncoming(payload);

      // remove from saved by lineId or productId
      const updatedSaved = state.savedItems.filter(
        (i) =>
          String(i.lineId) !== String(fromSaved.lineId) &&
          String(i.productId) !== String(fromSaved.productId)
      );

      const updatedCarts = mergeIntoCarts(state.carts, fromSaved);

      const t = recompute(updatedCarts);
      const newState = {
        ...state,
        savedItems: updatedSaved,
        carts: updatedCarts,
        cartItemNumbers: t.qty,
        cartTotalAmount: Number(t.total.toFixed(2)),
        cartTotalQuantity: t.qty,
      };
      persist(newState);
      return newState;
    }

    // DELETE FROM SAVED (by id or lineId)
    case ActionTypes.DELETE_FROM_SAVED: {
      const key = getKey(payload);
      const updatedSaved = state.savedItems.filter((i) => !sameRow(i, key));
      const newState = { ...state, savedItems: updatedSaved };
      persist(newState);
      return newState;
    }

    // EMPTY CART
    case ActionTypes.EMPTY_CART: {
      const cleared = {
        cartItemNumbers: 0,
        carts: [],
        cartTotalQuantity: 0,
        cartTotalAmount: 0,
        savedItems: state.savedItems || [],
      };
      persist(cleared);
      return cleared;
    }

    default:
      return state;
  }
};
