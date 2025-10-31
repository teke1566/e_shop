import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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


function App() {

  return (
    
    <BrowserRouter>
 {/* <marquee
        behavior="scroll"
        direction="left"
        scrollamount="8"
        style={{
          backgroundColor: "#222",
          color: "white",
          padding: "8px",
          fontWeight: "bold",
          fontSize: "1rem",
        }}
      >
        🛍️ Black Friday Deals! Up to 70% Off on Select Products 🎉
      </marquee> */}
      <Routes>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/cart" element={<CartPage />} />
         <Route path="/search" element={<SearchPage />}/>
         <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
