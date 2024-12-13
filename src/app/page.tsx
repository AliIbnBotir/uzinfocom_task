"use client";
import { ArrowIcon } from "@/icons";
import { initDB } from "@/utils/indexedDB";

import Products from "@/components/Products";
import Product from "@/components/Product";
import CheckoutForm from "@/components/CheckoutForm";

export default function Home() {
  initDB();
  return (
    <div className="">
      <main className="max-h-screen flex gap-12 p-8 sm:p-12">
        <section className="flex flex-col w-full flex-1 max-h-full">
          <header className="flex items-center gap-2 border-b-[1.5px] border-b-[#D0CFCF] py-2  top-0 bg-white left-0 right-0 sm:sticky">
            <ArrowIcon />
            <h1 className="text-4xl font-bold text-center sm:text-left text-lg font-semibold">
              Shopping Cart
            </h1>
          </header>
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col mb-4">
              <h2 className="text-lg font-medium">Shopping cart</h2>
              <p className="text-sm">You have 3 items in your cart</p>
            </div>
            <Products
              className="flex flex-col gap-4"
              item={(product) => (
                <Product
                  className="shadow-[0px_1px_4px_0px_#00000040]"
                  item={product}
                />
              )}
            />
          </div>
        </section>
        <aside className="max-w-[400px]">
          <CheckoutForm />
        </aside>
      </main>
    </div>
  );
}
