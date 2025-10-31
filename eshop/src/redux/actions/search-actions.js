import axios from "axios";

export const searchProducts = (query = "", category = "All") => {
  return async (dispatch) => {
    dispatch({ type: "SEARCH_REQUEST" });

    try {
      const res = await axios.get("https://api.escuelajs.co/api/v1/products");
      const products = res.data;

      const normalizedQuery = query.trim().toLowerCase();
      const normalizedCategory = category.trim().toLowerCase();

      //  Amazon-like name mapping → API categories
      const categoryMap = {
        "clothing, shoes & jewelry": ["clothes", "shoes"],
        "clothes": ["clothes"],
        "shoes": ["shoes"],
        "electronics": ["electronics"],
        "furniture": ["furniture"],
        "beauty & personal care": ["miscellaneous"],
        "home & kitchen": ["furniture"],
        "sports & outdoors": ["miscellaneous"],
        "books": ["miscellaneous"],
        "baby": ["miscellaneous"],
        "automotive": ["miscellaneous"],
      };

      const mappedCategories =
        categoryMap[normalizedCategory] || [normalizedCategory];

      // ✅ Filter
      const filtered = products.filter((item) => {
        const itemCategory = item.category?.name?.toLowerCase();
        const matchesCategory =
          normalizedCategory === "all" ||
          normalizedCategory === "all departments" ||
          mappedCategories.includes(itemCategory);

        const matchesQuery =
          !normalizedQuery ||
          item.title?.toLowerCase().includes(normalizedQuery) ||
          item.description?.toLowerCase().includes(normalizedQuery);

        return matchesCategory && matchesQuery;
      });

      dispatch({ type: "SEARCH_SUCCESS", payload: filtered });
    } catch (error) {
      dispatch({
        type: "SEARCH_FAIL",
        payload: error.response?.data?.message || error.message,
      });
    }
  };
};

export const clearSearchResults = () => ({
  type: "CLEAR_SEARCH_RESULTS",
});
