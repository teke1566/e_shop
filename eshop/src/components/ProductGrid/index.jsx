import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/actions/cart-actions";
import ProductCard from "../ProductCard";
import ProductAddToCartModal from "../ProductModal";

const ProductGrid = ({ products, loading, error }) => {
  const dispatch = useDispatch();
  const [show, setShow] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);

  const SVG_FALLBACK = useMemo(
    () =>
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'>
           <defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
             <stop offset='0%' stop-color='#f3f4f6'/><stop offset='100%' stop-color='#e5e7eb'/>
           </linearGradient></defs>
           <rect width='100%' height='100%' fill='url(#g)'/>
           <g fill='#9ca3af'>
             <rect x='140' y='170' width='320' height='200' rx='8' opacity='0.45'/>
             <circle cx='220' cy='270' r='34' opacity='0.45'/>
           </g>
           <text x='50%' y='78%' dominant-baseline='middle' text-anchor='middle'
                 font-family='sans-serif' font-size='28' fill='#9ca3af'>No Image</text>
         </svg>`
      ),
    []
  );

  const toAbsolute = (url) => {
    if (!url) return null;
    return /^https?:\/\//i.test(url)
      ? url
      : `http://localhost:9191/${String(url).replace(/^\/+/, "")}`;
  };

  const uniq = (arr) => Array.from(new Set(arr));

  const normalizeProduct = (p) => {
    // --- images from all possible shapes ---
    let imgs = [];

    if (Array.isArray(p?.images)) imgs = imgs.concat(p.images);
    if (Array.isArray(p?.imageUrls)) imgs = imgs.concat(p.imageUrls);
    if (Array.isArray(p?.productImages)) {
      imgs = imgs.concat(
        p.productImages
          .map((pi) => pi?.imageUrl ?? pi?.image_url ?? pi?.url)
          .filter(Boolean)
      );
    }
    if (p?.imageUrl || p?.image_url || p?.image)
      imgs.push(p.imageUrl ?? p.image_url ?? p.image);

    imgs = uniq(imgs.map(toAbsolute).filter(Boolean));
    if (imgs.length === 0) imgs = [SVG_FALLBACK];

    // --- id / name / price / category from common keys ---
    const productId = p.productId ?? p.id ?? p.product_id;
    const productName =
      p.productName ?? p.title ?? p.name ?? p.product_name ?? "Unnamed Product";
    const price = Number(p.price ?? p.unitPrice ?? p.unit_price ?? 0);
    const quantity = Number(p.quantity ?? p.qty ?? 0);
    const categoryId = p.categoryId ?? p.category_id ?? p.category?.id;
    const categoryName =
      p.categoryName ??
      p.category_name ??
      (typeof p.category === "object"
        ? p.category?.name ?? p.category?.title
        : p.category) ??
      "General";

    return {
     
      productId,
      productName,
      title: productName,          
      price,
      quantity,
      categoryId,
      categoryName,
      imageUrls: imgs,
      images: imgs,             
      ...p,                        
    };
  };

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setShow(true);
  };

  const handleConfirmAdd = (product) => {
    dispatch(addToCart(product));
  };

  // --- Conditional UI ---
  if (loading)
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-warning" role="status" />
        <p className="mt-3 text-muted">Loading products...</p>
      </div>
    );

  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  if (!products?.length)
    return (
      <div className="text-center text-muted py-5">
        <i className="bi bi-search display-5 d-block mb-3" />
        <p>No products found.</p>
      </div>
    );

  return (
    <>
      <div className="row g-4">
        {products.map((p, idx) => {
          const normalized = normalizeProduct(p);
          return (
            <ProductCard
              key={normalized.productId ?? `prod-${idx}`}
              product={normalized}
              onAddToCart={handleAddToCart}
            />
          );
        })}
      </div>

      <ProductAddToCartModal
        show={show}
        onClose={() => setShow(false)}
        product={selectedProduct}
        onAdd={handleConfirmAdd}
      />
    </>
  );
};

export default ProductGrid;
