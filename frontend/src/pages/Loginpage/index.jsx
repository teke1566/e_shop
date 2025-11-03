import React, { useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Axios instance hitting API Gateway
const api = axios.create({
  baseURL: "http://localhost:9191",
});

// Helper: decode JWT payload safely
const decodeJwt = (token) => {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

// Validation schema
const emailOrUsernameSchema = Yup.string()
  .required("Email or username is required")
  .test("email-or-username", "Enter a valid email or username", (value) => {
    if (!value) return false;
    const v = String(value).trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const isUsername = /^[a-zA-Z0-9._-]{3,}$/.test(v);
    return isEmail || isUsername;
  });

const validationSchema = Yup.object({
  emailOrUsername: emailOrUsernameSchema,
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [responseMsg, setResponseMsg] = useState({ message: "", type: "" });

  const initialValues = {
    emailOrUsername: "",
    password: "",
  };

  const onSubmit = async (values, { setSubmitting }) => {
    setResponseMsg({ message: "", type: "" });

    try {
      // Call login endpoint via Gateway
      const res = await api.post("/api/auth/login", {
        usernameOrEmail: values.emailOrUsername.trim(),
        password: values.password,
      });

      console.log("Login response:", res.data);

      // Handle both {token, role} object or plain token
      let token, role;
      if (typeof res.data === "string") {
        token = res.data;
        role = "ROLE_USER";
      } else {
        token = res.data?.token;
        role = res.data?.role || "ROLE_USER";
      }

      if (!token) throw new Error("Invalid response: no token received");

      // Store token and role in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Decode expiry if available
      const jwt = decodeJwt(token);
      if (jwt?.exp) localStorage.setItem("token_exp", String(jwt.exp * 1000));

      // Success message
      setResponseMsg({ message: "Login successful!", type: "success" });

      const search = new URLSearchParams(location.search);
      const next = search.get("next");
      setTimeout(() => {
        if (role === "ROLE_ADMIN") {
          navigate("/admin/products", { replace: true });
        } else {
          navigate(next || "/", { replace: true });
        }
      }, 700);
    } catch (err) {
      console.error("Login error:", err.response || err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (err?.response?.status === 401
          ? "Invalid credentials"
          : "Login failed. Please try again.");
      setResponseMsg({ message: msg, type: "danger" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow-lg p-4 border-0 rounded-4">
          <h2 className="text-center text-primary mb-3">Login</h2>
          <hr />

          {responseMsg.message && (
            <div
              className={`alert alert-${responseMsg.type} text-center`}
              role="alert"
            >
              {responseMsg.message}
            </div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form noValidate>
                {/* Email or Username */}
                <div className="mb-3">
                  <label htmlFor="emailOrUsername" className="form-label">
                    Email or Username
                  </label>
                  <Field
                    type="text"
                    name="emailOrUsername"
                    id="emailOrUsername"
                    className="form-control"
                    placeholder="you@example.com or admin"
                  />
                  <ErrorMessage
                    name="emailOrUsername"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    className="form-control"
                    placeholder="••••••••"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Signing in…
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </Form>
            )}
          </Formik>

          <p className="text-center mt-3 mb-0">
            New user? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
