import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/Loginpage";
import CartPage from "./pages/CartPage";
import SearchPage from "./pages/SearchPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import AdminProducts from "./components/Admin/AdminProducts";
import AdminRoute from "./components/Admin/AdminRoute";

import { hasRole } from "./utils/auth";

function HomeGate() {
  return hasRole("ROLE_ADMIN") ? <Navigate to="/admin/products" replace /> : <HomePage />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeGate />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/search" element={<SearchPage />}/>
        <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />

        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
