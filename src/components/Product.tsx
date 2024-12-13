import { ArrowDownFilledIcon, ArrowUpFilledIcon, TrashIcon } from "@/icons";
import {
  changeProductCountAsync,
  removeProductAsync,
} from "@/lib/features/cart/cartSlice";
import { useAppDispatch } from "@/lib/hooks";
import { ProductType } from "@/utils/indexedDB";
import Image from "next/image";

export interface ProductProps extends React.HTMLAttributes<HTMLDivElement> {
  item: ProductType;
}
export default function Product({ item, className, ...props }: ProductProps) {
  const dispatch = useAppDispatch();
  return (
    <div
      className={`${
        className || ""
      } flex gap-4 items-center  rounded-2xl p-2 justify-between pr-4`}
      {...props}
    >
      <div className="flex gap-4 items-center">
        <Image width={80} height={80} src={item.image} alt={item.title} />
        <div className="flex flex-col">
          <h2>{item.title}</h2>
          <p>{item.description}</p>
        </div>
      </div>
      <div className="flex justify-between flex-auto max-w-[40%] items-center">
        <div className="flex gap-2 items-center">
          <h2 className="text-[#393939] text-xl w-[20px] max-w-[20px] text-right">
            {item.count}
          </h2>
          <div className="flex flex-col gap-1">
            <button
              onClick={async () => {
                await dispatch(
                  changeProductCountAsync({
                    id: item.id,
                    amount: item.count + 1,
                  })
                );
              }}
            >
              <ArrowUpFilledIcon />
            </button>
            <button
              disabled={item.count === 1}
              className="disabled:cursor-not-allowed"
              onClick={async () => {
                await dispatch(
                  changeProductCountAsync({
                    id: item.id,
                    amount: item.count - 1,
                  })
                );
              }}
            >
              <ArrowDownFilledIcon />
            </button>
          </div>
        </div>
        <p className="text-sm font-medium">${item.price}</p>
        <button
          onClick={async () => {
            await dispatch(removeProductAsync(item.id));
          }}
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}
