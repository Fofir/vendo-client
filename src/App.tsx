import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import MainPage from "./MainPage";
import Login from "./Login";
import Register from "./Register";
import { FC, useCallback } from "react";
import VendoApiClient from "./VendoApiClient";
import LoadingScreen from "./components/LoadingScreen";
import useAuth from "./hooks/useAuth";
import useProducts from "./hooks/useProducts";

const App: FC<{ api: VendoApiClient }> = ({ api }) => {
  const {
    isAuthChecked,
    user,
    logout,
    deposit,
    login,
    register,
    getUser,
    resetDeposit,
  } = useAuth({
    api,
  });

  const {
    buy,
    getProducts,
    products,
    removeProduct,
    addProduct,
    updateProduct,
  } = useProducts({ api });

  const buyProduct = useCallback(
    async (productId: number, amount: number) => {
      await buy(productId, amount);
      await getUser();
    },
    [buy, getUser]
  );

  if (!isAuthChecked) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              updateProduct={updateProduct}
              addProduct={addProduct}
              products={products}
              getProducts={getProducts}
              removeProduct={removeProduct}
              logout={logout}
              deposit={deposit}
              user={user}
              buy={buyProduct}
              resetDeposit={resetDeposit}
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
