import {createSlice} from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

// Utility function to calculate updated quantity and total
const calculateUpdatedQuantityAndTotal = (products) => {
  const updatedQuantity = products.reduce((sum, product) => sum + product.quantity, 0);
  const updatedTotal = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
  return { updatedQuantity, updatedTotal };
};

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        products: [], // Initial Array of products in the cart
        quantity: 0, // Initial quantity of items in the cart
        total: 0, // Initial Total cost of items in the cart
    },
    reducers: {
       // Action: Add a product to the cart
      addProduct: (state, action) => {
        if (state?.products.length > 0) {
          let productIndex;
          // Deep copy the products array to avoid mutation
          const productToUpdate = JSON.parse(
            JSON.stringify(state.products)
          ).find((product, index) => {
            if (product._id == action.payload._id &&
                product.size == action.payload.size &&
                product.color == action.payload.color) {
                  productIndex = index;
                  return product;
                }
          });

          if (productToUpdate) {
            // Update quantity if the product already exists
            state.products[productIndex].quantity += 1;
          } else {
            // Add the product to the array if it doesn't exist
            state.products.push(action.payload);
          }
        } else {
          // Add the first product to the cart
          state.products.push(action.payload);
        }

        //x Here we need to check if the product with identical properties exists in the cart
        // TRUE: Update Quantity by 1
        //x FALSE: PUSH into state.products array

        // Calculate updated quantity and total
        const { updatedQuantity, updatedTotal } = calculateUpdatedQuantityAndTotal(state.products);
        state.quantity = updatedQuantity;
        state.total = updatedTotal;
        // state.total += action.payload.price * action.payload.quantity;
      },
      // Action: Remove a product from the cart
      removeProduct: (state, action) => {
        if (state?.products.length > 0) {
          let productIndex;
          const productToUpdate = JSON.parse(
            JSON.stringify(state.products)
          ).find((product, index) => {
            if (product._id == action.payload._id &&
                product.size == action.payload.size &&
                product.color == action.payload.color) {
                  productIndex = index;
                  return product;
                }
          });

          if (productToUpdate) {
            if (state.products[productIndex].quantity > 1) {
              // Decrease quantity if it's greater than 1
              state.products[productIndex].quantity -= 1;
            } else {
              // Remove the product if quantity is 1
              state.products.splice(productIndex, 1);
            }
          }
        }
        // Here we need to check if the product with identical properties exists in the cart
        // TRUE:
          // Current Quantity = 1 then remove the product from state.products array
          // Current Quantity > 1 then Update Quantity by -1
        // FALSE: Don't do anything
        // state.products.push(action.payload);
        const { updatedQuantity, updatedTotal } = calculateUpdatedQuantityAndTotal(state.products);
        state.quantity = updatedQuantity;
        state.total = updatedTotal;
      },
    // new action to UPDATE the Cart
    updateQuantity: (state, action) => {
      const { productId, newQuantity } = action.payload;

      const productToUpdate = state.products.find((product) => product._id === productId);

      if (productToUpdate) {
        // const quantityDifference = productToUpdate.quantity + newQuantity;
        state.products.quantity += newQuantity;
        // state.total += quantityDifference * productToUpdate.price;
        // productToUpdate.quantity = newQuantity;
      }
    },
    // new action to RESET the cart state -> after LOGOUT & CLEAR CART functionalities
    resetCart: (state) => {
      state.products = [];
      state.quantity = 0;
      state.total = 0;
    },
    }
});

export const {addProduct, removeProduct, resetCart, updateQuantity} = cartSlice.actions;
export default cartSlice.reducer;