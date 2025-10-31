import { ActionTypes } from "../constants/action-types";

//  Read from localStorage safely
const localData = JSON.parse(localStorage.getItem("eshop_cart")) || {};

//  Proper initialization (no circular self-reference)
const initialState = {
  cartItemNumbers: localData.cartItemNumbers || 0,
  carts: localData.carts || [],
  cartTotalQuantity: localData.cartTotalQuantity || 0,
  cartTotalAmount: localData.cartTotalAmount || 0,
  savedItems: localData.savedItems || [], //  safe
};

export const cartReducer = (state = initialState, { type, payload }) => {
  const saveToLocalStorage = (data) => {
    localStorage.setItem("eshop_cart", JSON.stringify(data));
  };

  switch (type) {
    case ActionTypes.GET_CART_ITEMS_NUMBERS:
      return { ...state };

    //  ADD TO CART (Amazon style)
    case ActionTypes.ADD_TO_CART: {
      let updatedCarts = [...state.carts];
      const existingIndex = updatedCarts.findIndex((item) => item.id === payload.id);

      if (existingIndex !== -1) {
        updatedCarts[existingIndex] = {
          ...updatedCarts[existingIndex],
          quantity: updatedCarts[existingIndex].quantity + 1,
        };
      } else {
        updatedCarts = [...updatedCarts, { ...payload, quantity: payload.quantity || 1 }];
      }

      const { total, quantity } = updatedCarts.reduce(
        (sum, item) => {
          sum.total += item.price * item.quantity;
          sum.quantity += item.quantity;
          return sum;
        },
        { total: 0, quantity: 0 }
      );

      const newState = {
        ...state,
        carts: updatedCarts,
        cartItemNumbers: quantity,
        cartTotalAmount: parseFloat(total.toFixed(2)),
        cartTotalQuantity: quantity,
      };

      saveToLocalStorage(newState);
      return newState;
    }

    //  DELETE FROM CART
    case ActionTypes.DELETE_FROM_CART: {
      const updatedCarts = state.carts.filter((item) => item.id !== payload.id);
      const { total, quantity } = updatedCarts.reduce(
        (sum, item) => {
          sum.total += item.price * item.quantity;
          sum.quantity += item.quantity;
          return sum;
        },
        { total: 0, quantity: 0 }
      );

      const newState = {
        ...state,
        carts: updatedCarts,
        cartItemNumbers: quantity,
        cartTotalAmount: parseFloat(total.toFixed(2)),
        cartTotalQuantity: quantity,
      };

      saveToLocalStorage(newState);
      return newState;
    }

    //  DECREASE QUANTITY
    case ActionTypes.DECREASE_QUANTITY: {
      const updatedCarts = state.carts
        .map((item) =>
          item.id === payload.id
            ? { ...item, quantity: Math.max(item.quantity - 1, 0) }
            : item
        )
        .filter((item) => item.quantity > 0);

      const { total, quantity } = updatedCarts.reduce(
        (sum, item) => {
          sum.total += item.price * item.quantity;
          sum.quantity += item.quantity;
          return sum;
        },
        { total: 0, quantity: 0 }
      );

      const newState = {
        ...state,
        carts: updatedCarts,
        cartItemNumbers: quantity,
        cartTotalAmount: parseFloat(total.toFixed(2)),
        cartTotalQuantity: quantity,
      };

      saveToLocalStorage(newState);
      return newState;
    }

    // SAVE FOR LATER
    case ActionTypes.SAVE_FOR_LATER: {
      const updatedCarts = state.carts.filter((c) => c.id !== payload.id);
      const updatedSaved = [...state.savedItems, payload];

      const { total, quantity } = updatedCarts.reduce(
        (sum, item) => {
          sum.total += item.price * item.quantity;
          sum.quantity += item.quantity;
          return sum;
        },
        { total: 0, quantity: 0 }
      );

      const newState = {
        ...state,
        carts: updatedCarts,
        savedItems: updatedSaved,
        cartItemNumbers: quantity,
        cartTotalAmount: parseFloat(total.toFixed(2)),
        cartTotalQuantity: quantity,
      };

      saveToLocalStorage(newState);
      return newState;
    }

    //  MOVE BACK TO CART
    case ActionTypes.MOVE_TO_CART: {
      const updatedSaved = state.savedItems.filter((i) => i.id !== payload.id);
      const updatedCarts = [...state.carts, { ...payload, quantity: 1 }];

      const { total, quantity } = updatedCarts.reduce(
        (sum, item) => {
          sum.total += item.price * item.quantity;
          sum.quantity += item.quantity;
          return sum;
        },
        { total: 0, quantity: 0 }
      );

      const newState = {
        ...state,
        savedItems: updatedSaved,
        carts: updatedCarts,
        cartItemNumbers: quantity,
        cartTotalAmount: parseFloat(total.toFixed(2)),
        cartTotalQuantity: quantity,
      };

      saveToLocalStorage(newState);
      return newState;
    }

    // ✅ DELETE FROM SAVED
    case ActionTypes.DELETE_FROM_SAVED: {
      const updatedSaved = state.savedItems.filter((item) => item.id !== payload);
      const newState = { ...state, savedItems: updatedSaved };
      saveToLocalStorage(newState);
      return newState;
    }

    // ✅ EMPTY CART
    case ActionTypes.EMPTY_CART: {
      const clearedState = {
        cartItemNumbers: 0,
        carts: [],
        cartTotalQuantity: 0,
        cartTotalAmount: 0,
        savedItems: state.savedItems || [],
      };
      saveToLocalStorage(clearedState);
      return clearedState;
    }

    default:
      return state;
  }
};
