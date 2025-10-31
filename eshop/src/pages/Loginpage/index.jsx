import React, { useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [responseMsg, setResponseMsg] = useState({
    message: "",
    alertClass: "",
  });

  // Initial form values
  const initialValues = {
    email: "",
    password: "",
  };

  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  // Handle submit
  const onSubmit = (values, { setSubmitting }) => {
    axios
      .post("http://localhost:9191/api/auth/login", {
        usernameOrEmail: values.email,
        password: values.password,
      })
      .then((response) => {
        console.log(" Login success:", response.data);

        // Show success message
        setResponseMsg({
          message: "🎉 Login Successful!",
          alertClass: "alert alert-success text-center",
        });

        //  Save token directly — backend returns plain JWT string
        localStorage.setItem("token", response.data);

        // Optional: small delay before redirect
        setTimeout(() => navigate("/"), 1000);
      })
      .catch((error) => {
        console.error("❌ Login failed:", error);
        setResponseMsg({
          message: "❌ Login Failed! Please try again.",
          alertClass: "alert alert-danger text-center",
        });
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow-lg p-4 border-0 rounded-4">
          <h2 className="text-center text-primary mb-3">Login</h2>
          <hr />

          {/* Message banner */}
          {responseMsg.message && (
            <div className={responseMsg.alertClass} role="alert">
              {responseMsg.message}
            </div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isValid, isSubmitting }) => (
              <Form>
                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    className="form-control"
                    placeholder="you@example.com"
                  />
                  <ErrorMessage
                    name="email"
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

                {/* Submit button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={!isValid || isSubmitting}
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

          {/* Register link */}
          <p className="text-center mt-3 mb-0">
            New user?{" "}
            <Link to="/register" className="text-decoration-none">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
