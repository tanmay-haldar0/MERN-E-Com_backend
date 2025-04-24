import {configureStore} from "@reduxjs/toolkit"
import { userReducer } from "./reducers/user";
import { sellerReducer } from "./reducers/seller";
import { productReducer } from "./reducers/product";
import { cartReducer } from "./reducers/cart";

const store = configureStore({
    reducer:{
        user:userReducer,
        seller:sellerReducer,
        product:productReducer,
        cart: cartReducer,
    }
});

export default store;