import React, { useState } from "react";
import CartItemCard from "../CartItemCard";

const CartItems = ({ carts }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  if (!carts || carts.length === 0) {
    return <p className="text-muted">Your cart is empty.</p>;
  }

  return (
    <div>
      {carts.map((item, index) => (
        <CartItemCard
          key={`${item.id || item.productId || item.title || "item"}-${index}`}
          item={item}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      ))}
    </div>
  );
};

export default CartItems;
