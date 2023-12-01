import {createSlice} from '@reduxjs/toolkit';

const calculateUpdatedQuantityAndTotal = (products) => {
  const updatedQuantity = products.reduce((sum, product) => sum + product.quantity, 0);
  const updatedTotal = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
  return { updatedQuantity, updatedTotal };
};

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        products: [],
        quantity: 0,
        total: 0,
    },
    reducers: {
      addProduct: (state, action) => {
        state.products.push(action.payload);
        const { updatedQuantity, updatedTotal } = calculateUpdatedQuantityAndTotal(state.products);
        state.quantity = updatedQuantity;
        state.total = updatedTotal;
        // state.quantity += 1;
        // state.total += action.payload.price * action.payload.quantity;
      },
    // new action to UPDATE the Cart
    updateQuantity: (state, action) => {
      const { productId, newQuantity } = action.payload;
      const productToUpdate = state.products.find((product) => product._id === productId);

      if (productToUpdate) {
        const quantityDifference = newQuantity - productToUpdate.quantity;
        state.quantity += quantityDifference;
        state.total += quantityDifference * productToUpdate.price;
        productToUpdate.quantity = newQuantity;
      }
    },
    // new action to RESET the cart state
    resetCart: (state) => {
      state.products = [];
      state.quantity = 0;
      state.total = 0;
    },
    }
});

export const {addProduct, resetCart, updateQuantity} = cartSlice.actions;
export default cartSlice.reducer;