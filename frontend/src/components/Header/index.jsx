import React from "react";

const Header = () => {
  return (
    <header className="jumbotron bg-light text-center py-5 mb-0">
      <div className="container">
        {/* Title */}
        <h1 className="display-4 fw-bold text-primary mb-3">
          Welcome to <span className="text-dark">eShop</span> 🛒
        </h1>

        {/* Subtitle */}
        <p className="lead text-secondary mb-4">
          Your one-stop destination for amazing deals and quality products.
        </p>

        {/* Divider */}
        <hr className="my-4 w-50 mx-auto" />

        {/* Secondary line */}
        <p className="text-muted mb-4">
          Explore thousands of categories, enjoy exclusive discounts, and shop
          with confidence.
        </p>

        {/* CTA Button */}
        <a href="/products" className="btn btn-primary btn-lg shadow-sm">
          Start Shopping
        </a>
      </div>
    </header>
  );
};

export default Header;
