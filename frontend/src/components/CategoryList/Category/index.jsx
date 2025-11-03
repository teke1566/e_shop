import React from "react";
import { Link } from "react-router-dom";

const Category = ({ data }) => {
  const { id, name, imageUrl } = data;

  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div className="card h-100 text-center border-0 shadow-sm">
        <Link to={`/products?category=${id}`} className="text-decoration-none text-dark">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="card-img-top img-fluid" />
          ) : (
            <div
              className="d-flex align-items-center justify-content-center bg-light text-muted"
              style={{ height: "200px" }}
            >
              No Image
            </div>
          )}
        </Link>
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <Link to={`/products?category=${id}`} className="btn btn-primary btn-sm">
            View Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Category;
