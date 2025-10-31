import React from "react";
import CartItemCard from "../CartItemCard";

const CartItems = ({ carts }) => {
  if (!carts || carts.length === 0) {
    return <p className="text-muted">Your cart is empty.</p>;
  }

  return (
    <div>
      {carts.map((item, index) => (
        <CartItemCard key={index} item={item} />
      ))}
    </div>
  );
};

export default CartItems;
