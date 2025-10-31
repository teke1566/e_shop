import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const RegisterPage = () => {
  const initialValues = {
    firstName: "",
    email: "",
    mobile: "",
    password: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format"),
    mobile: Yup.string()
      .required("Mobile is required")
      .length(10, "Mobile number must be 10 digits"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const onSubmit = (values) => {
    console.log("Form Data:", values);
    alert(`🎉 Welcome ${values.firstName}!`);
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    validateOnMount: true,
  });

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow-lg p-4 border-0 rounded-4">
          <h2 className="text-center text-primary mb-3">Register</h2>
          <hr />

          <form onSubmit={formik.handleSubmit} noValidate>
            {/* First Name */}
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                className={`form-control ${
                  formik.errors.firstName && formik.touched.firstName
                    ? "is-invalid"
                    : ""
                }`}
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="John"
              />
              {formik.errors.firstName && formik.touched.firstName && (
                <div className="text-danger small mt-1">
                  {formik.errors.firstName}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                className={`form-control ${
                  formik.errors.email && formik.touched.email
                    ? "is-invalid"
                    : ""
                }`}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="you@example.com"
              />
              {formik.errors.email && formik.touched.email && (
                <div className="text-danger small mt-1">
                  {formik.errors.email}
                </div>
              )}
            </div>

            {/* Mobile */}
            <div className="mb-3">
              <label htmlFor="mobile" className="form-label">
                Mobile
              </label>
              <input
                id="mobile"
                name="mobile"
                type="text"
                className={`form-control ${
                  formik.errors.mobile && formik.touched.mobile
                    ? "is-invalid"
                    : ""
                }`}
                value={formik.values.mobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="1234567890"
              />
              {formik.errors.mobile && formik.touched.mobile && (
                <div className="text-danger small mt-1">
                  {formik.errors.mobile}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className={`form-control ${
                  formik.errors.password && formik.touched.password
                    ? "is-invalid"
                    : ""
                }`}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="••••••••"
              />
              {formik.errors.password && formik.touched.password && (
                <div className="text-danger small mt-1">
                  {formik.errors.password}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={!formik.isValid}
            >
              Register
            </button>
          </form>

          {/* Footer */}
          <p className="text-center mt-3 mb-0">
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-none">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
