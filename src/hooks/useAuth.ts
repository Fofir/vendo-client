import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import VendoApiClient, { UserRole } from "../VendoApiClient";

const useAuth = ({ api }: { api: VendoApiClient }) => {
  const navigate = useNavigate();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    username: string;
    role: UserRole;
    deposit: number;
  }>({
    username: "",
    role: UserRole.BUYER,
    deposit: 0,
  });

  const getUser = useCallback(async () => {
    try {
      const response = await api.getUser();
      setUser({
        username: response.username,
        role: response.role,
        deposit: response.deposit,
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
        deposit: response.deposit,
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
        deposit: response.deposit,
      });

      setIsAuthChecked(true);
      setIsAuthenticated(true);
      return response;
    },
    [api]
  );

  const deposit = useCallback(
    async (denomination: number) => {
      const response = await api.deposit(denomination);

      setUser({
        ...user,
        deposit: response.deposit,
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
      deposit: 0,
    });

    setIsAuthChecked(true);
    setIsAuthenticated(false);
  }, [api]);

  useEffect(() => {
    getUser();
  }, [getUser]);

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
    deposit,
    login,
    register,
    getUser,
  };
};

export default useAuth;
