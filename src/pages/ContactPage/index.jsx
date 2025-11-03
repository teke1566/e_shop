import React from "react";
import Navbar from "../../components/Navbar";

const ContactPage = () => {
  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <div className="jumbotron text-center bg-light mt-4 py-5 shadow-sm">
        <h1 className="display-4 text-primary font-weight-bold">Contact Us</h1>
        <p className="lead text-secondary">
          We’d love to hear from you! Get in touch with us using the form below.
        </p>
        <hr className="my-4" />
        <p>
          Whether you have a question, feedback, or a business inquiry — we’re here to help.
        </p>
      </div>

      {/* Contact Form Section */}
      <div className="container mb-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm border-0 p-4">
              <h4 className="text-center mb-4 text-primary">Send Us a Message</h4>
              <form>
                <div className="form-group mb-3">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    rows="4"
                    className="form-control"
                    placeholder="Write your message here..."
                  ></textarea>
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-primary px-4">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Contact Info Section */}
      <div className="bg-light py-4">
        <div className="container text-center">
          <h5 className="text-secondary mb-3">Other Ways to Reach Us</h5>
          <p className="mb-1">
            📧 <strong>Email:</strong> support@eshop.com
          </p>
          <p className="mb-0">
            📞 <strong>Phone:</strong> +1 (800) 123-4567
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
