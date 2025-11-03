import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import {
  searchProducts,
  clearSearchResults,
} from "../../redux/actions/search-actions";
import {
  isAuthenticated,
  getToken,
  getRole,
  hasRole,
  logout,
} from "../../utils/auth"; // ✅ use consistent utils
import "./index.css";

const isAll = (s = "") => /^all(\s*departments)?$/i.test(s.trim());

const decodeJwt = (tkn) => {
  try {
    const [, payload] = String(tkn || "").split(".");
    if (!payload) return null;
    const b64 = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payload.length / 4) * 4, "=");
    return JSON.parse(atob(b64));
  } catch {
    return null;
  }
};

const firstValid = (...vals) => {
  for (const v of vals) {
    if (v == null) continue;
    if (Array.isArray(v)) continue;
    const s = String(v).trim();
    if (!s) continue;
    return s;
  }
  return null;
};

const readDisplayName = () => {
  const p = decodeJwt(getToken()) || {};
  return firstValid(
    p.username,
    p.preferred_username,
    p.name,
    p.sub && (p.sub.includes("@") ? p.sub.split("@")[0] : p.sub),
    p.upn && p.upn.split("@")[0],
    p.email && p.email.split("@")[0]
  );
};

/* ================================================= */

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [displayName, setDisplayName] = useState(null);
  const [category, setCategory] = useState("All Departments");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItemCount =
    useSelector((state) => state.cart?.cartTotalQuantity) || 0;
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
    setIsLoggedIn(isAuthenticated());
    setDisplayName(readDisplayName());
    const history = JSON.parse(localStorage.getItem("recent_searches") || "[]");
    setRecentSearches(history);
  }, []);

  const saveToRecentSearches = (term) => {
    const updated = [term, ...recentSearches.filter((t) => t !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    const shouldSearch = value.trim().length >= 3 || !isAll(category);
    if (shouldSearch) {
      dispatch(searchProducts(value, category));
      setShowDropdown(true);
    } else {
      dispatch(clearSearchResults());
      setShowDropdown(true);
    }
  };

  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    setCategory(newCat);
    const shouldSearch = query.trim().length >= 3 || !isAll(newCat);
    if (shouldSearch) {
      dispatch(searchProducts(query, newCat));
      setShowDropdown(true);
    } else {
      dispatch(clearSearchResults());
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const hasCategory = !isAll(category);
    const hasQuery = query.trim().length > 0;
    if (!hasCategory && !hasQuery) return;
    dispatch(searchProducts(query, category));
    navigate(
      `/search?query=${encodeURIComponent(query)}&cat=${encodeURIComponent(
        category
      )}`
    );
    setShowDropdown(false);
  };

  const handleSelect = (term) => {
    setQuery(term);
    saveToRecentSearches(term);
    dispatch(searchProducts(term, category));
    navigate(
      `/search?query=${encodeURIComponent(term)}&cat=${encodeURIComponent(
        category
      )}`
    );
    setShowDropdown(false);
  };

  const clearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem("recent_searches");
  };

  // ✅ Fixed logout to use correct tokens
  const handleSignOut = () => {
    logout(); // clears token, role, token_exp
    setIsLoggedIn(false);
    setDisplayName(null);
    navigate("/login");
  };

  const handleSignIn = () => navigate("/login");

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
            onChange={handleCategoryChange}
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
                  results.map((item) => {
                    const pid = item.id ?? item.productId;
                    const title = item.title ?? item.productName ?? "Unnamed";
                    const thumb =
                      (Array.isArray(item.images) && item.images[0]) ||
                      (Array.isArray(item.imageUrls) && item.imageUrls[0]) ||
                      "https://via.placeholder.com/40";
                    const catName =
                      item.category?.name ?? item.categoryName ?? "Category";

                    return (
                      <div
                        key={pid}
                        onClick={() => {
                          navigate(`/products/${pid}`);
                          setShowDropdown(false);
                        }}
                        className="dropdown-result"
                      >
                        <img
                          src={thumb}
                          alt={title}
                          width="40"
                          height="40"
                          className="rounded me-3"
                          style={{ objectFit: "cover" }}
                          onError={(e) =>
                            (e.currentTarget.src =
                              "https://via.placeholder.com/40")
                          }
                        />
                        <div>
                          <div className="fw-semibold text-truncate">
                            {title}
                          </div>
                          <small className="text-muted">{catName}</small>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="dropdown-empty">No results found</div>
                ))}
            </div>
          )}
        </form>

        {/* Right Section */}
        <div className="amazon-right d-flex align-items-center">
          {/* ✅ Admin visible only if role is admin */}
          {isAuthenticated() && hasRole("ROLE_ADMIN") && (
            <Link to="/admin/products" className="text-white me-4 fw-semibold">
              Admin
            </Link>
          )}

          {/* Account Hover Menu */}
          <div
            className="amazon-account text-white me-4 position-relative"
            onMouseEnter={() => setShowAccountMenu(true)}
            onMouseLeave={() => setShowAccountMenu(false)}
          >
            <span className="small text-muted">
              Hello{displayName ? "," : ", "}
            </span>
            <div className="fw-semibold">
              {displayName ? displayName : "Sign in"}
            </div>
            <div className="small">Account &amp; Lists ▾</div>

            {showAccountMenu && (
              <div className="account-hover-menu">
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                  <span className="fw-semibold text-dark">
                    {displayName ? `Hi, ${displayName}` : "Welcome"}
                  </span>
                  <div>
                    {isLoggedIn ? (
                      <button
                        onClick={handleSignOut}
                        className="btn btn-link small text-primary p-0"
                      >
                        Sign out
                      </button>
                    ) : (
                      <button
                        onClick={handleSignIn}
                        className="btn btn-link small text-primary p-0"
                      >
                        Sign in
                      </button>
                    )}
                  </div>
                </div>

                <div className="d-flex">
                  {/* Left Column */}
                  <div className="p-3 border-end" style={{ width: "40%" }}>
                    <h6 className="fw-bold">Your Lists</h6>
                    <ul className="list-unstyled small">
                      <li>
                        <Link to="/lists" className="text-dark text-decoration-none">
                          Create a List
                        </Link>
                      </li>
                      <li>
                        <Link to="/registry" className="text-dark text-decoration-none">
                          Find a List or Registry
                        </Link>
                      </li>
                      <li>
                        <Link to="/saved" className="text-dark text-decoration-none">
                          Your Saved Books
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Right Column */}
                  <div className="p-3" style={{ flex: 1 }}>
                    <h6 className="fw-bold">Your Account</h6>
                    <ul className="list-unstyled small">
                      <li>
                        <Link to="/orders" className="text-dark text-decoration-none">
                          Orders
                        </Link>
                      </li>
                      <li>
                        <Link to="/history" className="text-dark text-decoration-none">
                          Browsing History
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/preferences"
                          className="text-dark text-decoration-none"
                        >
                          Shopping Preferences
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/subscriptions"
                          className="text-dark text-decoration-none"
                        >
                          Memberships &amp; Subscriptions
                        </Link>
                      </li>
                      <li>
                        <Link to="/sell" className="text-dark text-decoration-none">
                          Start a Selling Account
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="cart-btn position-relative text-white me-3">
            <i className="bi bi-cart3 fs-5"></i>
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
            <span className="ms-1 fw-semibold">Cart</span>
          </Link>
        </div>
      </nav>

      <ToastContainer theme="colored" position="bottom-right" autoClose={1500} />
    </>
  );
};

export default Navbar;
