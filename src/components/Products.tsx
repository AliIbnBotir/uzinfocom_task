import { getProductsAsync } from "@/lib/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ProductType } from "@/utils/indexedDB";
import React, { useEffect } from "react";

export interface Products extends React.HTMLAttributes<HTMLDivElement> {
  list?: (products?: ProductType[]) => React.ReactNode;
  item?: (product: ProductType) => React.ReactNode;
}

export default function Products({ list, item, ...props }: Products) {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.cart.products);
  const status = useAppSelector((state) => state.cart.status);

  useEffect(() => {
    setTimeout(() => {
      dispatch(getProductsAsync());
    }, 1000);
  }, [dispatch]);
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (status === "failed" || !products) {
    return <div>No products found</div>;
  }
  return (
    <div {...props}>
      {list
        ? list(products)
        : products?.map((product) => (
            <div key={product.id}>
              {item ? item(product) : <div>{product.title}</div>}
            </div>
          ))}
    </div>
  );
}
