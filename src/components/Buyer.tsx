import { FC, useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import cx from "classnames";
import { Product } from "../VendoApiClient";
import Button from "./Button";

const ALLOWED_DENOMINATIONS = [5, 10, 20, 50, 100];

const ProductListItem: FC<{
  deposit: number;
  product: Product;
  buy: (productId: number, amount: number) => Promise<void>;
}> = ({ product, deposit, buy }) => {
  const [amount, setAmount] = useState(1);

  const onAmountChange = useCallback((newAmount: number) => {
    setAmount(newAmount || 0);
  }, []);

  const totalCost = amount * product.cost;

  const onBuy = useCallback(async () => {
    await buy(product.id, amount);
    setAmount(1);
  }, [amount, buy, product]);

  const showInsufficientFundsError = totalCost > deposit;

  return (
    <li className="flex items-center justify-between border-y p-2 last:border-y-0">
      <div>
        <div className="font-semiold">{product.productName}</div>
        <div>
          <span className="font-mono">{product.amountAvailable}</span> Available
          | <span className="font-mono">{product.cost}</span> Cents
        </div>
      </div>
      {product.amountAvailable > 0 ? (
        <div className="space-y-1">
          <div className="flex items-center">
            <label htmlFor="amount">
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(evt) =>
                  onAmountChange(parseInt(evt.target.value, 10))
                }
                className="rounded rounded-tr-none rounded-br-none h-8 text-sm border border-gray-300 border-r-0"
                min={1}
                max={product.amountAvailable}
              />
            </label>
            <Button
              disabled={totalCost > deposit || totalCost === 0}
              className="rounded-l-none"
              onClick={onBuy}
            >
              Buy
            </Button>
          </div>
          <div
            className={cx("text-xs font-light", {
              "text-gray-500": !showInsufficientFundsError,
              "text-red-500": showInsufficientFundsError,
            })}
          >
            Total: {totalCost} Cents
            {showInsufficientFundsError && <p>Insufficient funds</p>}
          </div>
        </div>
      ) : (
        "❌ Unavailable"
      )}
    </li>
  );
};

const Buyer: FC<{
  depositValue: number;
  deposit: (denomination: number) => Promise<number | undefined>;
  getProducts: () => Promise<void>;
  buy: (productId: number, amount: number) => Promise<void>;
  products: Product[];
  resetDeposit: () => Promise<void>;
}> = ({ depositValue, deposit, getProducts, products, buy, resetDeposit }) => {
  const [isDepositing, setIsDepositing] = useState(false);

  const onDenominationClick = useCallback(
    async (denomination: number) => {
      setIsDepositing(true);
      await deposit(denomination);
      toast.success(`You successfully deposited ${denomination} cents`);
      setIsDepositing(false);
    },
    [deposit]
  );

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <div className="py-4 space-y-4">
      <div className="border border-gray-200 rounded-sm p-2 flex items-center justify-between">
        <div>💰 You have {depositValue} cents.</div>
        <div>
          <Button disabled={depositValue === 0} onClick={resetDeposit}>
            Reset
          </Button>
        </div>
      </div>
      <div className="border border-gray-200 rounded-sm p-2 space-y-2">
        <h3>💳 Deposit cents:</h3>
        <div className="space-x-2">
          {ALLOWED_DENOMINATIONS.map((denomination) => (
            <Button
              disabled={isDepositing}
              className="border px-2 rounded hover:opacity-60 transition-opacity py-1 disabled:opacity-50"
              key={`denomination-${denomination}`}
              onClick={() => onDenominationClick(denomination)}
            >
              {denomination}
            </Button>
          ))}
        </div>
      </div>
      <div className="border border-gray-200 rounded-sm py-2 space-y-2">
        <h2 className=" px-2 text-xl font-semibold">Available products</h2>
        <ul className="">
          {products.map((product) => (
            <ProductListItem
              key={product.id}
              product={product}
              deposit={depositValue}
              buy={buy}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Buyer;
