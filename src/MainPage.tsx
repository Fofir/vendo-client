import { FC } from "react";
import { Product, UserRole } from "./VendoApiClient";
import Seller from "./components/Seller";
import Buyer from "./components/Buyer";

const BuyerApp: FC<{
  deposit: number;
  username: string;
  products: Product[];
  role?: UserRole;
  logout: () => Promise<void>;
  onDeposit: (denomination: number) => Promise<number>;
  getProducts: () => Promise<void>;
  removeProduct: (productId: number) => Promise<void>;
  buy: (productId: number, amount: number) => Promise<void>;
}> = ({
  role,
  deposit,
  username,
  onDeposit,
  logout,
  getProducts,
  products,
  removeProduct,
  buy,
}) => {
  return (
    <div className="flex flex-col">
      <div className="bg-vendo-primary text-white px-4 py-2 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl inline-block mr-1">VENDO</h1>
          <small>{role}</small>
        </div>
        <div>
          <span>Hi {username}! 👋</span>{" "}
          <button onClick={logout} className="text-xs underline">
            Logout
          </button>
        </div>
      </div>
      <main className="px-4">
        {role === UserRole.SELLER ? (
          <Seller
            removeProduct={removeProduct}
            getProducts={getProducts}
            products={products}
          />
        ) : (
          <Buyer
            products={products}
            getProducts={getProducts}
            onDeposit={onDeposit}
            deposit={deposit}
            buy={buy}
          />
        )}
      </main>
    </div>
  );
};

export default BuyerApp;
