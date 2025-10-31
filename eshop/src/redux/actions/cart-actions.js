import { ActionTypes } from "../constants/action-types";

//  Add item to cart
export const addToCart = (product) => ({
  type: ActionTypes.ADD_TO_CART,
  payload: product,
});

export const decreaseQuantity = ( id) => ({
  type: ActionTypes.DECREASE_QUANTITY,
  payload: {  id },
});

export const deleteFromCart = (product) => ({
  type: ActionTypes.DELETE_FROM_CART,
  payload: product,
});


//  Empty the entire cart (for "Clear Cart" button)
export const emptyCart = () => ({
  type: ActionTypes.EMPTY_CART,
});


export const getTotalCartAmount = () => ({
  type: ActionTypes.GET_TOTAL_CART_AMOUNT,
});
export const saveForLater = (item) => ({
  type: ActionTypes.SAVE_FOR_LATER,
  payload: item,
});

export const moveToCart = (item) => ({
  type: ActionTypes.MOVE_TO_CART,
  payload: item,
});

export const deleteFromSaved = (id) => {
  return {
    type: ActionTypes.DELETE_FROM_SAVED,
    payload: id,
  };
};