import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import VendoApiClient, { UserRole } from "../VendoApiClient";
import { toast } from "react-hot-toast";
import { formatChangeToText, notifyError } from "../utils";

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
      notifyError(err);
    } finally {
      setIsAuthChecked(true);
    }
  }, [api]);

  const login = useCallback(
    async ({ username, password }: { username: string; password: string }) => {
      try {
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
      } catch (err) {
        notifyError(err);
      }
    },
    [api]
  );

  const register = useCallback(
    async ({ username, password }: { username: string; password: string }) => {
      try {
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
      } catch (err) {
        notifyError(err);
      }
    },
    [api]
  );

  const deposit = useCallback(
    async (denomination: number) => {
      try {
        const response = await api.deposit(denomination);

        setUser({
          ...user,
          deposit: response.deposit,
        });

        return response.deposit;
      } catch (err) {
        notifyError(err);
      }
    },
    [user, api]
  );

  const resetDeposit = useCallback(async () => {
    try {
      const { change } = await api.resetDeposit();
      toast.success(
        `Your deposit was reset succesfully.\nHere is your change: ${formatChangeToText(
          change
        )}`
      );
      setUser({
        ...user,
        deposit: 0,
      });
    } catch (err) {
      notifyError(err);
    }
  }, [api, user]);

  const logout = useCallback(async () => {
    try {
      await api.logout();

      setUser({
        username: "",
        role: UserRole.BUYER,
        deposit: 0,
      });

      setIsAuthChecked(true);
      setIsAuthenticated(false);
    } catch (err) {
      notifyError(err);
    }
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
    resetDeposit,
  };
};

export default useAuth;
