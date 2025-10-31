import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { searchProducts, clearSearchResults } from "../../redux/actions/search-actions";
import "./index.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [category, setCategory] = useState("All Departments");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItemCount = useSelector((state) => state.cart?.cartTotalQuantity || 0);
  const { results, loading } = useSelector((state) => state.search);

  const categories = [
    "All Departments",
    "Alexa Skills",
    "Amazon Devices",
    "Amazon Fresh",
    "Amazon Global Store",
    "Amazon Pharmacy",
    "Apps & Games",
    "Arts, Crafts & Sewing",
    "Automotive",
    "Baby",
    "Beauty & Personal Care",
    "Books",
    "CDs & Vinyl",
    "Cell Phones & Accessories",
    "Clothing, Shoes & Jewelry",
    "Collectibles & Fine Art",
    "Computers",
    "Credit and Payment Cards",
    "Digital Music",
    "Electronics",
    "Garden & Outdoor",
    "Gift Cards",
    "Grocery & Gourmet Food",
    "Handmade",
    "Health, Household & Baby Care",
    "Home & Kitchen",
    "Industrial & Scientific",
    "Kindle Store",
    "Luggage & Travel Gear",
    "Luxury Stores",
    "Movies & TV",
    "Musical Instruments",
    "Office Products",
    "Pet Supplies",
    "Prime Video",
    "Smart Home",
    "Software",
    "Sports & Outdoors",
    "Tools & Home Improvement",
    "Toys & Games",
    "Video Games",
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    const history = JSON.parse(localStorage.getItem("recent_searches")) || [];
    setRecentSearches(history);
  }, []);

  const saveToRecentSearches = (term) => {
    let updated = [term, ...recentSearches.filter((item) => item !== term)];
    updated = updated.slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim().length > 2) {
      dispatch(searchProducts(value, category));
      setShowDropdown(true);
    } else {
      dispatch(clearSearchResults());
      setShowDropdown(true);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const hasCategory = category && category !== "All";
    const hasQuery = query.trim() !== "";
    if (!hasCategory && !hasQuery) return;
    dispatch(searchProducts(query, category));
    navigate(`/search?query=${encodeURIComponent(query)}&cat=${encodeURIComponent(category)}`);
    setShowDropdown(false);
  };

  const handleSelect = (term) => {
    setQuery(term);
    saveToRecentSearches(term);
    navigate(`/search?query=${encodeURIComponent(term)}&cat=${category}`);
    setShowDropdown(false);
  };

  const clearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem("recent_searches");
  };

  const onLogoutHandler = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <>
      <nav className="amazon-navbar px-3 py-2">
        {/* Logo */}
        <Link className="navbar-brand fw-bold text-white amazon-logo" to="/">
          eShop<span className="amazon-sub">.prime</span>
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="amazon-search d-flex mx-auto position-relative"
        >
          <select
            className="amazon-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="search"
            className="amazon-input"
            placeholder="Search eShop"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          />

          <button type="submit" className="amazon-btn">
            <i className="bi bi-search"></i>
          </button>

          {showDropdown && (
            <div className="amazon-dropdown-container">
              {query.trim().length < 3 && (
                <>
                  {recentSearches.length > 0 && (
                    <>
                      <div className="dropdown-header d-flex justify-content-between">
                        <strong>🕓 Recent Searches</strong>
                        <button
                          className="btn btn-link text-danger p-0 small"
                          onClick={clearHistory}
                        >
                          Clear
                        </button>
                      </div>
                      {recentSearches.map((term, i) => (
                        <div
                          key={i}
                          onClick={() => handleSelect(term)}
                          className="dropdown-item"
                        >
                          <i className="bi bi-clock-history me-2 text-secondary"></i>
                          {term}
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}

              {query.trim().length >= 3 &&
                (loading ? (
                  <div className="dropdown-loading">Loading...</div>
                ) : results.length > 0 ? (
                  results.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        navigate(`/products/${item.id}`);
                        setShowDropdown(false);
                      }}
                      className="dropdown-result"
                    >
                      <img
                        src={item.images?.[0] || "https://via.placeholder.com/40"}
                        alt={item.title}
                        width="40"
                        height="40"
                        className="rounded me-3"
                        style={{ objectFit: "cover" }}
                      />
                      <div>
                        <div className="fw-semibold text-truncate">{item.title}</div>
                        <small className="text-muted">
                          {item.category?.name || "Category"}
                        </small>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="dropdown-empty">No results found</div>
                ))}
            </div>
          )}
        </form>

        {/* Right Section */}
        <div className="amazon-right d-flex align-items-center">
          {/* Account Hover Menu */}
          <div
            className="amazon-account text-white me-4 position-relative"
            onMouseEnter={() => setShowAccountMenu(true)}
            onMouseLeave={() => setShowAccountMenu(false)}
          >
            <span className="small text-muted">Hello, Teketsel</span>
            <div className="fw-semibold">Account & Lists</div>

            {showAccountMenu && (
              <div className="account-hover-menu">
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                  <span className="fw-semibold text-dark">
                    Who's shopping? Select a profile.
                  </span>
                  <div>
                    <Link to="/login" className="text-primary small me-3">Switch Accounts</Link>
                    <button onClick={onLogoutHandler} className="btn btn-link small text-primary p-0">Sign Out</button>
                  </div>
                </div>

                <div className="d-flex">
                  {/* Left Column */}
                  <div className="p-3 border-end" style={{ width: "40%" }}>
                    <h6 className="fw-bold">Your Lists</h6>
                    <ul className="list-unstyled small">
                      <li><Link to="/lists" className="text-dark text-decoration-none">Create a List</Link></li>
                      <li><Link to="/registry" className="text-dark text-decoration-none">Find a List or Registry</Link></li>
                      <li><Link to="/saved" className="text-dark text-decoration-none">Your Saved Books</Link></li>
                    </ul>
                  </div>

                  {/* Right Column */}
                  <div className="p-3" style={{ flex: 1 }}>
                    <h6 className="fw-bold">Your Account</h6>
                    <ul className="list-unstyled small">
                      <li><Link to="/orders" className="text-dark text-decoration-none">Orders</Link></li>
                      <li><Link to="/recommendations" className="text-dark text-decoration-none">Recommendations</Link></li>
                      <li><Link to="/history" className="text-dark text-decoration-none">Browsing History</Link></li>
                      <li><Link to="/preferences" className="text-dark text-decoration-none">Shopping Preferences</Link></li>
                      <li><Link to="/subscriptions" className="text-dark text-decoration-none">Memberships & Subscriptions</Link></li>
                      <li><Link to="/prime" className="text-dark text-decoration-none">Prime Membership</Link></li>
                      <li><Link to="/sell" className="text-dark text-decoration-none">Start a Selling Account</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="cart-btn position-relative text-white me-3">
            <i className="bi bi-cart3 fs-5"></i>
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            <span className="ms-1 fw-semibold">Cart</span>
          </Link>

          {isLoggedIn ? (
            <button onClick={onLogoutHandler} className="btn btn-danger btn-sm">
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn btn-warning btn-sm">
              Login
            </Link>
          )}
        </div>
      </nav>

      <ToastContainer theme="colored" position="bottom-right" autoClose={1500} />
    </>
  );
};

export default Navbar;