import { KeyboardRightIcon } from "@/icons";
import { useAppSelector } from "@/lib/hooks";
import { getDeliveryPrice } from "@/utils/indexedDB";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

type FormDataType = {
  name: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
};

export default function CheckoutForm() {
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const products = useAppSelector((state) => state.cart.products);

  const subtotalMemo = useMemo(() => {
    if (!products) return 0;
    return products.reduce((total, product) => {
      return total + product.price * product.count;
    }, 0);
  }, [products]);

  const totalMemo = useMemo(() => {
    if (!deliveryPrice) return 0;
    return subtotalMemo + deliveryPrice;
  }, [subtotalMemo, deliveryPrice]);
  useEffect(() => {
    const fetchDeliveryPrice = async () => {
      const price = await getDeliveryPrice();
      setDeliveryPrice(price);
    };
    fetchDeliveryPrice();
  }, []);

  const { register, handleSubmit } = useForm<FormDataType>({
    defaultValues: {
      name: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });
  const onSubmit = (data: FormDataType) => {
    console.log(data);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="block rounded-xl bg-[#565ABB] p-4 text-[#FEFCFC]"
    >
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Card Details</h1>
      </header>
      <section className="flex flex-col gap-2 mt-2">
        <p className="text-base font-medium">Card type</p>
        <div className="grid grid-cols-4 gap-3">
          <div>
            <Image width={75} height={55} src="/cards/master-card.png" alt="" />
          </div>
          <div>
            <Image width={75} height={55} src="/cards/visa-card.png" alt="" />
          </div>
          <div>
            <Image width={75} height={55} src="/cards/rupay.png" alt="" />
          </div>
          <div className="bg-[#D9D9D933] p-2 rounded-md h-full flex items-center justify-center cursor-pointer">
            <p className="text-sm font-bold">See all</p>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-4 mt-4 border-b-[1px] border-b-[#5F65C3] pb-4">
        <div>
          <p className="text-sm font-medium">Name on card</p>
          <input
            type="text"
            {...register("name")}
            required
            placeholder="Name"
            className="w-full bg-[#D9D9D933] rounded-md p-2 placeholder:text-[#C4C4C4] placeholder:text-xs"
          />
        </div>
        <div>
          <p className="text-sm font-medium">Card number</p>

          <input
            type="text"
            required
            {...register("cardNumber")}
            placeholder="1111 2222 3333 4444"
            className="w-full bg-[#D9D9D933] rounded-md p-2 placeholder:text-[#C4C4C4] placeholder:text-xs"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col w-full">
            <p className="text-sm font-medium">Expiry date</p>
            <input
              type="text"
              placeholder="MM/YY"
              {...register("expiryDate")}
              required
              className="w-full bg-[#D9D9D933] rounded-md p-2 placeholder:text-[#C4C4C4] placeholder:text-xs"
            />
          </div>
          <div className="flex flex-col w-full">
            <p className="text-sm font-medium">CVV</p>
            <input
              type="text"
              required
              {...register("cvv")}
              placeholder="123"
              className="w-full bg-[#D9D9D933] rounded-md p-2 placeholder:text-[#C4C4C4] placeholder:text-xs"
            />
          </div>
        </div>
      </section>
      <section className="mt-4">
        <div className="grid grid-cols-2 mb-4">
          <p className="text-sm font-medium">Subtotal</p>
          <p className="text-sm font-medium text-right">${subtotalMemo}</p>
          <p className="text-sm font-medium">Delivery</p>
          <p className="text-sm font-medium text-right">${deliveryPrice}</p>
          <p className="text-sm font-medium">Total (Tax incl.)</p>
          <p className="text-sm font-medium text-right">${totalMemo}</p>
        </div>
      </section>

      <button
        type="submit"
        className="w-full bg-[#4DE1C1] flex items-center justify-between rounded-xl p-4"
      >
        <p className="text-base font-medium text-right">${totalMemo}</p>
        <div className="flex items-center gap-2">
          Checkout <KeyboardRightIcon />
        </div>
      </button>
    </form>
  );
}
