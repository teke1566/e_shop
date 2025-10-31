import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import { cartReducer } from "./reducers/cartReducer";
import { searchReducer } from "./reducers/searchReducer";

// Combine reducers
const rootReducer = combineReducers({
  cart: cartReducer,
  search: searchReducer,
});

//  Compose enhancers for middleware + Redux DevTools
const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//  Create store with both thunk + DevTools support
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export default store;
