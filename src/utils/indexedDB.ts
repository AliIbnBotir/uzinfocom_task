import { openDB, IDBPDatabase } from "idb";

export type ProductType = {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  count: number;
};
interface DataBase {
  deliveryPrice: number;
  products: ProductType[];
}

const predefinedData: DataBase = {
  deliveryPrice: 4,
  products: [
    {
      id: 1,
      title: "Italy Pizza",
      price: 681,
      description: "Extra cheese and toping",
      image: "/products/italy_pizza.png",
      count: 1,
    },
    {
      id: 2,
      title: "Combo Plate",
      price: 681,
      description: "Extra cheese and toping",
      image: "/products/combo-plate.png",
      count: 1,
    },
    {
      id: 3,
      title: "Spanish Rice",
      price: 681,
      description: "Extra garllic",
      image: "/products/spanish-rice.png",
      count: 1,
    },
  ],
};

const dbName = "shoppingCart";
const dbVersion = 1;

let db: IDBPDatabase<DataBase> | null = null;

export const initDB = async () => {
  if (typeof window === "undefined") {
    throw new Error(
      "IndexedDB is not supported in this browser. Please use a modern browser."
    );
  }
  db = await openDB<DataBase>(dbName, dbVersion, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("shoppingCartData"))
        db.createObjectStore("shoppingCartData");
    },
  });
  // now add predefined data
  const data = await db.get("shoppingCartData", "products");
  if (!data) {
    await db.put("shoppingCartData", predefinedData.products, "products");
    await db.put(
      "shoppingCartData",
      predefinedData.deliveryPrice,
      "deliveryPrice"
    );
  }
  return db;
};

export const getProducts = async (): Promise<ProductType[]> => {
  const db = await openDB<DataBase>(dbName, dbVersion);
  const data = await db.get("shoppingCartData", "products");
  return data;
};

export const getDeliveryPrice = async (): Promise<number> => {
  const db = await openDB<DataBase>(dbName, dbVersion);
  const data = await db.get("shoppingCartData", "deliveryPrice");
  return data;
};

export const changeProductCount = async (
  id: number,
  count: number
): Promise<ProductType[]> => {
  const db = await openDB<DataBase>(dbName, dbVersion);
  const data = (await db.get("shoppingCartData", "products")) as ProductType[];
  const updatedData = data.map((product) => {
    if (product.id === id) {
      return { ...product, count };
    }
    return product;
  });
  await db.put("shoppingCartData", updatedData, "products");
  return updatedData;
};

export const removeProduct = async (id: number): Promise<ProductType[]> => {
  const db = await openDB<DataBase>(dbName, dbVersion);
  const data = (await db.get("shoppingCartData", "products")) as ProductType[];
  const updatedData = data.filter((product) => product.id !== id);
  await db.put("shoppingCartData", updatedData, "products");
  return updatedData;
};
