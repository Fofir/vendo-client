import { FC } from "react";
import { Product, ProductPayload, UserRole } from "./VendoApiClient";
import Seller from "./components/Seller";
import Buyer from "./components/Buyer";

const BuyerApp: FC<{
  products: Product[];
  user: {
    deposit: number;
    username: string;
    role?: UserRole;
  };
  logout: () => Promise<void>;
  deposit: (denomination: number) => Promise<number>;
  getProducts: () => Promise<void>;
  removeProduct: (productId: number) => Promise<void>;
  addProduct: (payload: ProductPayload) => Promise<void>;
  updateProduct: (productId: number, payload: ProductPayload) => Promise<void>;
  buy: (productId: number, amount: number) => Promise<void>;
}> = ({
  user,
  deposit,
  logout,
  getProducts,
  products,
  removeProduct,
  buy,
  addProduct,
  updateProduct,
}) => {
  return (
    <div className="flex flex-col">
      <div className="bg-vendo-primary text-white px-4 py-2 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl inline-block mr-1">VENDO</h1>
          <small>{user.role}</small>
        </div>
        <div>
          <span>Hi {user.username}! 👋</span>{" "}
          <button onClick={logout} className="text-xs underline">
            Logout
          </button>
        </div>
      </div>
      <main className="px-4">
        {user.role === UserRole.SELLER ? (
          <Seller
            addProduct={addProduct}
            updateProduct={updateProduct}
            removeProduct={removeProduct}
            getProducts={getProducts}
            products={products}
          />
        ) : (
          <Buyer
            products={products}
            getProducts={getProducts}
            deposit={deposit}
            depositValue={user.deposit}
            buy={buy}
          />
        )}
      </main>
    </div>
  );
};

export default BuyerApp;
