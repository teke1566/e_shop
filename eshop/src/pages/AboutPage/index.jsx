import React from "react";
import Navbar from "../../components/Navbar";
import './style.css';

const AboutPage = () => {
  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <div className="jumbotron text-center bg-light mt-4 py-5 shadow-sm">
        <h1 className="display-4 text-primary font-weight-bold">About Us</h1>
        <p className="lead text-secondary">
          We’re passionate about building quality experiences for our customers.
        </p>
        <hr className="my-4" />
        <p>
          Our mission is to deliver excellence in design, development, and user
          satisfaction.
        </p>
      </div>

      {/* Content Section */}
      <div className="container mb-5">
        <section className="mb-4">
          <h3 className="text-dark mb-3">Who We Are</h3>
          <p className="text-muted">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Cupiditate, repudiandae. Tempora iusto deserunt molestiae dignissimos
            perferendis nesciunt illum, quidem aspernatur distinctio nostrum
            quibusdam. Quia porro aliquam ratione aspernatur, labore numquam
            dolore id exercitationem atque facere a saepe voluptas sapiente
            eligendi officiis laborum.
          </p>
        </section>

        <section className="mb-4">
          <h3 className="text-dark mb-3">Our Vision</h3>
          <p className="text-muted">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            officia dolores eligendi corrupti eveniet consectetur ad atque
            perspiciatis. Quos maxime quae ratione placeat soluta quasi sint.
            Quaerat voluptatibus possimus dolor! Quae ex nihil quasi at corporis
            molestias modi corporis voluptatibus nobis laudantium eos,
            necessitatibus vero magnam veritatis itaque incidunt.
          </p>
        </section>

        <section>
          <h3 className="text-dark mb-3">Our Values</h3>
          <ul className="list-unstyled text-muted">
            <li>✅ Innovation & Creativity</li>
            <li>✅ Customer-Centric Design</li>
            <li>✅ Transparency & Trust</li>
            <li>✅ Continuous Improvement</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
