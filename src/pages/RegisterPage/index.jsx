import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const api = axios.create({ baseURL: "http://localhost:9191" });

const RegisterPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = React.useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      mobile: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      username: Yup.string()
        .min(3, "Min 3 characters")
        .matches(/^[a-zA-Z0-9._-]+$/, "Letters, numbers, . _ - only")
        .required("Username is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      mobile: Yup.string().length(10, "Must be 10 digits").nullable(),
      password: Yup.string().min(6, "Min 6 characters").required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setServerError("");
      try {
        const payload = {
          name: values.name.trim(),
          username: values.username.trim(),
          email: values.email.trim(),
          password: values.password,
        };

        const res = await api.post("/api/auth/register", payload, {
          headers: { "Content-Type": "application/json" },
        });

        if (res.status === 200 || res.status === 201) {
          alert("🎉 Registration successful! Please sign in.");
          navigate("/login");
        }
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Registration failed";
        setServerError(msg);
      } finally {
        setSubmitting(false);
      }
    },
    validateOnMount: false,
  });

  const handleTrySubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const allTouched = Object.keys(formik.values).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {}
    );
    formik.setTouched(allTouched, true);

    const errors = await formik.validateForm();
    if (Object.keys(errors).length) return; 
    formik.handleSubmit(); 
  };

  const cls = (n) =>
    `form-control ${formik.touched[n] && formik.errors[n] ? "is-invalid" : ""}`;

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow-lg p-4 border-0 rounded-4">
          <h2 className="text-center text-primary mb-3">Register</h2>
          <hr />

          {serverError && <div className="alert alert-danger py-2">{serverError}</div>}

          <form onSubmit={handleTrySubmit} noValidate>
            <div className="mb-3">
              <label className="form-label" htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className={cls("name")}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="John Doe"
                autoComplete="name"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-danger small mt-1">{formik.errors.name}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                className={cls("username")}
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="teke5"
                autoComplete="username"
              />
              {formik.touched.username && formik.errors.username && (
                <div className="text-danger small mt-1">{formik.errors.username}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className={cls("email")}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-danger small mt-1">{formik.errors.email}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="mobile">Mobile (optional)</label>
              <input
                id="mobile"
                name="mobile"
                type="text"
                className={cls("mobile")}
                value={formik.values.mobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="0912345678"
                autoComplete="tel"
              />
              {formik.touched.mobile && formik.errors.mobile && (
                <div className="text-danger small mt-1">{formik.errors.mobile}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className={cls("password")}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-danger small mt-1">{formik.errors.password}</div>
              )}
            </div>

            {/* Always enabled; errors will show and prevent API call */}
            <button type="submit" className="btn btn-primary w-100">
              {formik.isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center mt-3 mb-0">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
