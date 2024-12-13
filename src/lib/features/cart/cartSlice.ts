import { createAppSlice } from "@/lib/createAppSlice";
import {
  changeProductCount,
  getProducts,
  ProductType,
  removeProduct,
} from "@/utils/indexedDB";

export interface CartSliceState {
  products: ProductType[];
  status: "idle" | "loading" | "failed";
}

const initialState: CartSliceState = {
  products: [],
  status: "idle",
};

export const cartSlice = createAppSlice({
  name: "cart",
  initialState,
  reducers: (create) => ({
    getProductsAsync: create.asyncThunk(
      async () => {
        const products = await getProducts();
        return products;
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "idle";
          state.products = action.payload;
        },
        rejected: (state) => {
          state.status = "failed";
        },
      }
    ),
    changeProductCountAsync: create.asyncThunk(
      async ({ id, amount }: { id: number; amount: number }) => {
        const products = await changeProductCount(id, amount);
        return products;
      },
      {
        fulfilled: (state, action) => {
          const product = state.products.find(
            (product) => product.id === action.meta.arg.id
          );
          if (product) {
            product.count = action.meta.arg.amount;
          }
        },
      }
    ),
    removeProductAsync: create.asyncThunk(
      async (id: number) => {
        const products = await removeProduct(id);
        return products;
      },
      {
        fulfilled: (state, action) => {
          state.status = "idle";
          state.products = action.payload;
        },
      }
    ),
  }),
  selectors: {
    selectProducts: (cart) => cart.products,
    selectStatus: (cart) => cart.status,
  },
});

export const { getProductsAsync, changeProductCountAsync, removeProductAsync } =
  cartSlice.actions;

export const { selectProducts, selectStatus } = cartSlice.selectors;
