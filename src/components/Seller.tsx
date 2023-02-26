import { FC, useEffect } from "react";
import { Product } from "../VendoApiClient";
import { Link } from "react-router-dom";

const Seller: FC<{
  products: Product[];
  removeProduct: (productId: number) => Promise<void>;
  getProducts: () => Promise<void>;
}> = ({ getProducts, products, removeProduct }) => {
  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <div className="py-4">
      <div className="border border-gray-200 rounded-sm p-2 space-y-2">
        <h2 className="text-xl font-semibold">My products</h2>
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
              <div>
                <Link to={`/products/${product.id}`}>Edit</Link>
                <button onClick={() => removeProduct(product.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Seller;
