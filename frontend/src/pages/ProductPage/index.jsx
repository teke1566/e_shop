import CategoryNavBar from "../../components/CategoryNavBar/index.jsx";
import Navbar from "../../components/Navbar";
import ProductList from "../../components/ProductList.jsx";
import SearchPage from "../SearchPage/index.jsx";


const ProductPage = () => {
  return (
    <div>
      <Navbar />
      <CategoryNavBar/>
      <ProductList />
    </div>
  );
};

export default ProductPage;
