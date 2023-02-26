import { FC, useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Product } from "../VendoApiClient";

const ALLOWED_DENOMINATIONS = [5, 10, 20, 50, 100];

const Buyer: FC<{
  deposit: number;
  onDeposit: (denomination: number) => Promise<number>;
  getProducts: () => Promise<void>;
  buy: (productId: number, amount: number) => Promise<void>;
  products: Product[];
}> = ({ deposit, onDeposit, getProducts, products, buy }) => {
  const [isDepositing, setIsDepositing] = useState(false);
  const onDenominationClick = useCallback(
    async (denomination: number) => {
      setIsDepositing(true);
      await onDeposit(denomination);
      toast.success(`You successfully deposited ${denomination} cents`);
      setIsDepositing(false);
    },
    [onDeposit]
  );

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <div className="py-4 space-y-4">
      <div className="border border-gray-200 rounded-sm p-2">
        💰 You have {deposit} cents.
      </div>
      <div className="border border-gray-200 rounded-sm p-2 space-y-2">
        <h3>💳 Deposit cents:</h3>
        <div className="space-x-2">
          {ALLOWED_DENOMINATIONS.map((denomination) => (
            <button
              disabled={isDepositing}
              className="border px-2 rounded hover:opacity-60 transition-opacity py-1 disabled:opacity-50"
              key={`denomination-${denomination}`}
              onClick={() => onDenominationClick(denomination)}
            >
              {denomination}
            </button>
          ))}
        </div>
      </div>
      <div className="border border-gray-200 rounded-sm p-2 space-y-2">
        <h2 className="text-xl font-semibold">Available products</h2>
        <ul>
          {products.map((product) => (
            <li className="flex items-center justify-between" key={product.id}>
              <div>
                <div className="font-semiold">{product.productName}</div>
                <div>
                  <span className="font-mono">{product.amountAvailable}</span>{" "}
                  Available | <span className="font-mono">{product.cost}</span>{" "}
                  Cents
                </div>
              </div>
              <button onClick={() => buy(product.id, 1)}>Buy</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Buyer;
