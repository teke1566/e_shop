import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HoverMenu.css";

const HoverMenu = ({ department }) => {
  const [open, setOpen] = useState(false);
  const [subcategories, setSubcategories] = useState([]);

  // fetch subcategories dynamically (mocking or using same API)
  useEffect(() => {
    if (open) {
      axios
        .get(`https://api.escuelajs.co/api/v1/categories`)
        .then((res) => {
          // filter or slice random categories for demo
          const related = res.data
            .filter((c) => c.id % department.id === 0 || c.id <= 10)
            .slice(0, 6);
          setSubcategories(related);
        })
        .catch((err) => console.error(err));
    }
  }, [open, department]);

  return (
    <div
      className="hover-menu-dynamic"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="btn btn-link text-white fw-semibold px-3 hover-menu-btn">
        {department.name} ▾
      </button>

      {open && (
        <div className="hover-dropdown-dynamic shadow">
          {subcategories.map((item) => (
            <div key={item.id} className="hover-item text-center">
              <img
                src={item.image}
                alt={item.name}
                className="hover-item-img mb-2"
              />
              <p className="small mb-0 text-truncate">{item.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HoverMenu;
