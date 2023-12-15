import { configureStore } from "@reduxjs/toolkit";
import { translateSlice } from "./translateSlice";

export default configureStore({
    reducer: {
        //slice kısmında doğrudan exp edildiği için translateSlice içindeki reducer'a eriştik
        translate: translateSlice.reducer
    }
})