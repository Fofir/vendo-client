import { toast } from "react-hot-toast";

import { useCallback, useState } from "react";
import VendoApiClient, { Product, ProductPayload } from "../VendoApiClient";
import { keyBy, orderBy } from "lodash";

const useProducts = ({ api }: { api: VendoApiClient }) => {
  const [products, setProducts] = useState<Record<string, Product>>({});

  const addProduct = useCallback(
    async (payload: ProductPayload) => {
      const newProduct = await api.addProduct(payload);
      setProducts({
        ...products,
        [newProduct.id]: newProduct,
      });
      toast.success(`Product "${payload.productName}" added succesfully`);
    },
    [api, products]
  );

  const updateProduct = useCallback(
    async (productId: number, payload: ProductPayload) => {
      const updatedProduct = await api.updateProduct(productId, payload);
      setProducts({
        ...products,
        [updatedProduct.id]: updatedProduct,
      });

      toast.success(`Product "${payload.productName}" updated succesfully`);
    },
    [api, products]
  );

  const removeProduct = useCallback(
    async (productId: number) => {
      await api.removeProduct(productId);
      const newProductsCollection = { ...products };
      toast.success(
        `Product "${products[productId].productName}" deleted succesfully`
      );
      delete newProductsCollection[productId];
      setProducts(newProductsCollection);
    },
    [api, products]
  );

  const getProducts = useCallback(async () => {
    const response = await api.getProducts();
    setProducts(keyBy(response, "id"));
  }, [api]);

  const buy = useCallback(
    async (productId: number, amount: number) => {
      const { spent, productName, change } = await api.buy({
        productId,
        amount,
      });

      toast.success(
        `Thank you for buying ${productName} for ${spent} cents.\n\nHere is your change: ${change.join(
          " cents, "
        )}`,
        {
          duration: 4000,
        }
      );

      setProducts({
        ...products,
        [productId]: {
          ...products[productId],
          amountAvailable: products[productId].amountAvailable - amount,
        },
      });
    },
    [api, products]
  );

  return {
    getProducts,
    addProduct,
    updateProduct,
    removeProduct,
    products: orderBy(products, ["productName"], ["asc"]),
    buy,
  };
};

export default useProducts;
