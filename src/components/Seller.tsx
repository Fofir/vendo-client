import {
  MouseEventHandler,
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Product, ProductPayload } from "../VendoApiClient";
import LoadingScreen from "./LoadingScreen";
import Button from "./Button";

const ProductListItem: FC<{
  product: Product;
  updateProduct: (productId: number, payload: ProductPayload) => Promise<void>;
  removeProduct: (productId: number) => Promise<void>;
}> = ({ product, removeProduct, updateProduct }) => {
  const [isEditing, setIsEditing] = useState(false);
  const onRemove = useCallback(async () => {
    await removeProduct(product.id);
  }, [product, removeProduct]);

  const onEdit = () => {
    setIsEditing(true);
  };

  const onSubmit = useCallback(
    async (payload: ProductPayload) => {
      await updateProduct(product.id, payload);
      setIsEditing(false);
    },
    [updateProduct, product]
  );

  return (
    <li className=" border-y last:border-none p-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semiold">{product.productName}</div>
          <div>
            <span className="font-mono">{product.amountAvailable}</span>{" "}
            Available | <span className="font-mono">{product.cost}</span> Cents
          </div>
        </div>
        <div className="space-x-2">
          <Button onClick={onEdit}>Edit</Button>
          <Button onClick={onRemove}>Delete</Button>
        </div>
      </div>
      {isEditing && (
        <ProductForm
          initialValues={product}
          submitForm={onSubmit}
          submitButtonText="Update"
          showCancelButton
          onCancel={() => setIsEditing(false)}
        />
      )}
    </li>
  );
};

const ProductForm: FC<{
  initialValues: ProductPayload;
  submitForm: (payload: ProductPayload) => Promise<void>;
  submitButtonText: string;
  showCancelButton?: boolean;
  onCancel?: MouseEventHandler;
}> = ({
  initialValues,
  submitForm,
  submitButtonText,
  showCancelButton,
  onCancel,
}) => {
  const [formValues, setFormValues] = useState(() => ({
    productName: initialValues.productName || "",
    cost: initialValues.cost || 5,
    amountAvailable: initialValues.amountAvailable || 1,
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFormChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target: { value, name } }) => {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    },
    [formValues]
  );

  const onSubmit: FormEventHandler = useCallback(
    async (evt) => {
      evt.preventDefault();

      if (isSubmitting) {
        return;
      }

      setIsSubmitting(true);
      await submitForm(formValues);
      setIsSubmitting(false);

      setFormValues({
        productName: "",
        cost: 5,
        amountAvailable: 1,
      });
    },
    [submitForm, formValues, isSubmitting]
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-rows-2 grid-cols-2 gap-4">
        <div className="space-y-0.5 col-span-2">
          <label htmlFor="productName" className="block text-sm text-gray-500">
            Product name:
          </label>
          <input
            disabled={isSubmitting}
            name="productName"
            onChange={onFormChange}
            required
            value={formValues.productName}
            className="h-8 rounded w-full disabled:opacity-50"
            type="text"
          />
        </div>
        <div className="space-y-0.5">
          <label
            htmlFor="amountAvailable"
            className="block text-sm text-gray-500"
          >
            Amount available:
          </label>
          <input
            disabled={isSubmitting}
            min={1}
            required
            onChange={onFormChange}
            name="amountAvailable"
            value={formValues.amountAvailable}
            className="h-8 rounded w-full disabled:opacity-50"
            type="number"
          />
        </div>
        <div className="space-y-0.5">
          <label htmlFor="cost" className="block text-sm text-gray-500">
            Cost (in cents):
          </label>
          <input
            disabled={isSubmitting}
            min={5}
            step={5}
            required
            name="cost"
            onChange={onFormChange}
            value={formValues.cost}
            className="h-8 rounded w-full disabled:opacity-50"
            type="number"
          />
        </div>
      </div>
      <div className="text-right space-x-2">
        {showCancelButton && onCancel && (
          <Button onClick={onCancel} variant="primary:inverted">
            Cancel
          </Button>
        )}
        <Button disabled={isSubmitting} type="submit">
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};

const Seller: FC<{
  products: Product[];
  removeProduct: (productId: number) => Promise<void>;
  getProducts: () => Promise<void>;
  addProduct: (payload: ProductPayload) => Promise<void>;
  updateProduct: (productId: number, payload: ProductPayload) => Promise<void>;
}> = ({ getProducts, products, removeProduct, addProduct, updateProduct }) => {
  const [areProductsLoading, setAreProductsLoading] = useState(true);
  const loadProducts = useCallback(async () => {
    await getProducts();
    setAreProductsLoading(false);
  }, [getProducts]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  if (areProductsLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="py-4 space-y-4">
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3">
          <div className="border border-gray-200 rounded-sm py-2 space-y-2">
            <h2 className="text-xl font-semibold px-2">My products</h2>
            {products.length > 0 && !areProductsLoading ? (
              <ul>
                {products.map((product) => (
                  <ProductListItem
                    key={product.id}
                    product={product}
                    removeProduct={removeProduct}
                    updateProduct={updateProduct}
                  />
                ))}
              </ul>
            ) : (
              <div>No products to show</div>
            )}
          </div>
        </div>
        <div className="col-span-2">
          <div className="border border-gray-200 rounded-sm p-2 space-y-2">
            <h2 className="text-xl font-semibold">Add Product</h2>
            <ProductForm
              submitForm={addProduct}
              initialValues={{
                productName: "",
                amountAvailable: 0,
                cost: 0,
              }}
              submitButtonText="Add"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seller;
