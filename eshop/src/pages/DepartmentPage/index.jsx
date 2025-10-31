import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import "./index.css";

const DepartmentPage = ({ departmentName }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load department subcategories
  useEffect(() => {
    axios
      .get("https://api.escuelajs.co/api/v1/categories")
      .then((res) => {
        // Mock filtering: in a real API you’d query by department id
        const deptSubs = res.data.slice(0, 10);
        setSubCategories(deptSubs);
        setSelectedSub(deptSubs[0]);
      })
      .catch(console.error);
  }, [departmentName]);

  // Load products when subcategory changes
  useEffect(() => {
    if (!selectedSub) return;
    setLoading(true);
    axios
      .get("https://api.escuelajs.co/api/v1/products")
      .then((res) => {
        const items = res.data.filter(
          (p) => p.category?.name === selectedSub.name
        );
        setProducts(items.slice(0, 12));
      })
      .finally(() => setLoading(false));
  }, [selectedSub]);

  return (
    <>
      <Navbar />

      {/* --- horizontal top sub-menu --- */}
      <div className="subnav shadow-sm">
        <div className="container-fluid d-flex overflow-auto py-2">
          {subCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedSub(c)}
              className={`btn btn-link px-3 fw-semibold ${
                selectedSub?.id === c.id ? "text-primary" : "text-dark"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="container-fluid mt-3">
        <div className="row">
          {/* --- Left sidebar --- */}
          <div className="col-md-3 col-lg-2 border-end">
            <h6 className="fw-bold mt-3">Department</h6>
            <p className="text-muted small mb-2">{departmentName}</p>
            <ul className="list-unstyled">
              {subCategories.map((c) => (
                <li
                  key={c.id}
                  className={`sidebar-item ${
                    selectedSub?.id === c.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedSub(c)}
                >
                  {c.name}
                </li>
              ))}
            </ul>
          </div>

          {/* --- Products --- */}
          <div className="col-md-9 col-lg-10">
            <h5 className="fw-bold mb-3">
              {selectedSub?.name || departmentName}
            </h5>

            {loading ? (
              <div className="text-center my-5">
                <div className="spinner-border text-warning" role="status" />
              </div>
            ) : (
              <div className="row g-4">
                {products.map((p) => (
                  <div key={p.id} className="col-lg-3 col-md-4 col-sm-6">
                    <div className="card h-100 shadow-sm border-0">
                      <img
                        src={
                          p.images?.[0] ||
                          "https://via.placeholder.com/200x200?text=No+Image"
                        }
                        alt={p.title}
                        className="card-img-top"
                        style={{
                          height: "200px",
                          objectFit: "cover",
                          borderBottom: "1px solid #eee",
                        }}
                      />
                      <div className="card-body">
                        <h6 className="card-title text-truncate">{p.title}</h6>
                        <h5 className="text-danger mb-2">${p.price}</h5>
                        <button className="btn btn-warning w-100 btn-sm">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DepartmentPage;
