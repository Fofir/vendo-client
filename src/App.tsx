import { Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import MainPage from "./MainPage";
import Login from "./Login";
import Register from "./Register";
import { FC, useCallback, useEffect, useState } from "react";
import VendoApiClient, { UserRole } from "./VendoApiClient";
import Spinner from "./components/Spinner";

const App: FC<{ api: VendoApiClient }> = ({ api }) => {
  const navigate = useNavigate();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    username: string;
    role: UserRole;
  } | null>(null);

  const getUser = useCallback(async () => {
    try {
      const response = await api.getUser();
      setUser({
        username: response.username,
        role: response.role,
      });
      setIsAuthenticated(true);
    } catch (err) {
    } finally {
      setIsAuthChecked(true);
    }
  }, []);

  const login = useCallback(
    async ({ username, password }: { username: string; password: string }) => {
      const response = await api.login({
        username,
        password,
      });

      setUser({
        username: response.username,
        role: response.role,
      });

      setIsAuthChecked(true);
      setIsAuthenticated(true);
      return response;
    },
    []
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
      });

      setIsAuthChecked(true);
      setIsAuthenticated(true);
      return response;
    },
    []
  );

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
        <Route path="/" element={<MainPage role={user?.role} />} />
        <Route path="login" element={<Login login={login} />} />
        <Route path="register" element={<Register register={register} />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
