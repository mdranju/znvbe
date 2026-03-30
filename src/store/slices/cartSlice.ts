import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  size: string;
  color?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const calculateTotals = (state: CartState) => {
  state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
  state.totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const newItem = action.payload;
      // Unique product in cart means same ID && same size && same color
      const existingItem = state.items.find(
        (item) =>
          item.id === newItem.id &&
          item.size === newItem.size &&
          item.color === newItem.color,
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
      calculateTotals(state);
    },
    removeFromCart(
      state,
      action: PayloadAction<{
        id: string | number;
        size: string;
        color?: string;
      }>,
    ) {
      state.items = state.items.filter(
        (item) =>
          !(
            item.id === action.payload.id &&
            item.size === action.payload.size &&
            item.color === action.payload.color
          ),
      );
      calculateTotals(state);
    },
    updateQuantity(
      state,
      action: PayloadAction<{
        id: string | number;
        size: string;
        color?: string;
        quantity: number;
      }>,
    ) {
      const item = state.items.find(
        (i) =>
          i.id === action.payload.id &&
          i.size === action.payload.size &&
          i.color === action.payload.color,
      );
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
      calculateTotals(state);
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    }
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
