const initialState = {
  results: [],
  loading: false,
  error: null,
};

export const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SEARCH_REQUEST":
      return { ...state, loading: true, error: null };

    case "SEARCH_SUCCESS":
      return { ...state, loading: false, results: action.payload };

    case "SEARCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "CLEAR_SEARCH_RESULTS":
      return { ...state, results: [] };

    default:
      return state;
  }
};
