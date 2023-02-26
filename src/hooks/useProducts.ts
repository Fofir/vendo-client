import { toast } from "react-hot-toast";

import { useCallback, useState } from "react";
import VendoApiClient, { Product, ProductPayload } from "../VendoApiClient";
import { keyBy, orderBy } from "lodash";
import { formatChangeToText, notifyError } from "../utils";

const useProducts = ({ api }: { api: VendoApiClient }) => {
  const [products, setProducts] = useState<Record<string, Product>>({});

  const addProduct = useCallback(
    async (payload: ProductPayload) => {
      try {
        const newProduct = await api.addProduct(payload);
        setProducts({
          ...products,
          [newProduct.id]: newProduct,
        });
        toast.success(`Product "${payload.productName}" added succesfully`);
      } catch (err) {
        notifyError(err);
      }
    },
    [api, products]
  );

  const updateProduct = useCallback(
    async (productId: number, payload: ProductPayload) => {
      try {
        const updatedProduct = await api.updateProduct(productId, payload);
        setProducts({
          ...products,
          [updatedProduct.id]: updatedProduct,
        });

        toast.success(`Product "${payload.productName}" updated succesfully`);
      } catch (err) {
        notifyError(err);
      }
    },
    [api, products]
  );

  const removeProduct = useCallback(
    async (productId: number) => {
      try {
        await api.removeProduct(productId);
        const newProductsCollection = { ...products };
        toast.success(
          `Product "${products[productId].productName}" deleted succesfully`
        );
        delete newProductsCollection[productId];
        setProducts(newProductsCollection);
      } catch (err) {
        notifyError(err);
      }
    },
    [api, products]
  );

  const getProducts = useCallback(async () => {
    try {
      const response = await api.getProducts();
      setProducts(keyBy(response, "id"));
    } catch (err) {
      notifyError(err);
    }
  }, [api]);

  const buy = useCallback(
    async (productId: number, amount: number) => {
      try {
        const { spent, productName, change } = await api.buy({
          productId,
          amount,
        });

        toast.success(
          `Thank you for buying ${productName} for ${spent} cents.\nHere is your change: ${formatChangeToText(
            change
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
      } catch (err) {
        notifyError(err);
      }
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
