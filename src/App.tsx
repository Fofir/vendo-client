import { Routes, Route, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import MainPage from "./MainPage";
import Login from "./Login";
import Register from "./Register";
import { FC, useCallback, useEffect, useState } from "react";
import VendoApiClient, { Product, UserRole } from "./VendoApiClient";
import Spinner from "./components/Spinner";
import { keyBy, orderBy } from "lodash";

const useAuth = ({ api }: { api: VendoApiClient }) => {
  const navigate = useNavigate();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    username: string;
    role: UserRole;
    desposit: number;
  }>({
    username: "",
    role: UserRole.BUYER,
    desposit: 0,
  });

  const getUser = useCallback(async () => {
    try {
      const response = await api.getUser();
      setUser({
        username: response.username,
        role: response.role,
        desposit: response.deposit,
      });
      setIsAuthenticated(true);
    } catch (err) {
    } finally {
      setIsAuthChecked(true);
    }
  }, [api]);

  const login = useCallback(
    async ({ username, password }: { username: string; password: string }) => {
      const response = await api.login({
        username,
        password,
      });

      setUser({
        username: response.username,
        role: response.role,
        desposit: response.deposit,
      });

      setIsAuthChecked(true);
      setIsAuthenticated(true);
      return response;
    },
    [api]
  );

  const register = useCallback(
    async ({ username, password }: { username: string; password: string }) => {
      const response = await api.register({
        username,
        password,
      });

      setUser({
        username: response.username,
        role: response.role,
        desposit: response.deposit,
      });

      setIsAuthChecked(true);
      setIsAuthenticated(true);
      return response;
    },
    [api]
  );

  const onDeposit = useCallback(
    async (denomination: number) => {
      const response = await api.deposit(denomination);

      setUser({
        ...user,
        desposit: response.deposit,
      });

      return response.deposit;
    },
    [user, api]
  );

  const logout = useCallback(async () => {
    await api.logout();

    setUser({
      username: "",
      role: UserRole.BUYER,
      desposit: 0,
    });

    setIsAuthChecked(true);
    setIsAuthenticated(false);
  }, [api]);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (isAuthChecked && isAuthenticated) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [isAuthChecked, isAuthenticated, navigate]);

  return {
    isAuthChecked,
    user,
    logout,
    onDeposit,
    login,
    register,
    getUser,
  };
};

const useProducts = ({ api }: { api: VendoApiClient }) => {
  const [products, setProducts] = useState<Record<string, Product>>({});

  const addProduct = useCallback(async () => {}, [api]);
  const removeProduct = useCallback(
    async (productId: number) => {
      await api.removeProduct(productId);
      const newProductsCollection = { ...products };
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
    addProduct,
    getProducts,
    removeProduct,
    products: orderBy(products, ["productName"], ["asc"]),
    buy,
  };
};

const App: FC<{ api: VendoApiClient }> = ({ api }) => {
  const { isAuthChecked, user, logout, onDeposit, login, register, getUser } =
    useAuth({
      api,
    });

  const { buy, getProducts, products, removeProduct } = useProducts({ api });

  const buyProduct = useCallback(
    async (productId: number, amount: number) => {
      await buy(productId, amount);
      await getUser();
    },
    [buy, getUser]
  );

  if (!isAuthChecked) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              products={products}
              getProducts={getProducts}
              removeProduct={removeProduct}
              logout={logout}
              onDeposit={onDeposit}
              username={user.username}
              deposit={user.desposit}
              role={user.role}
              buy={buyProduct}
            />
          }
        />
        <Route path="login" element={<Login login={login} />} />
        <Route path="register" element={<Register register={register} />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
