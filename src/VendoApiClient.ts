import axios, { Axios, AxiosPromise, AxiosResponse } from "axios";

export enum UserRole {
  BUYER = "BUYER",
  SELLER = "SELLER",
}

type UserResponse = AxiosResponse<{
  username: string;
  role: UserRole;
  deposit: number;
}>;

export class VendoApiClient {
  api: Axios;
  constructor({ baseURL }: { baseURL: string }) {
    this.api = axios.create({
      baseURL,
      withCredentials: true,
    });
  }

  getUser = async () => {
    const response = await this.api.get<any, UserResponse>("/user");
    return response.data;
  };

  register = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    const response = await this.api.post<any, UserResponse>("/user", {
      username,
      password,
    });

    return response.data;
  };

  login = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    const response = await this.api.post<any, UserResponse>("/auth/login", {
      username,
      password,
    });

    return response.data;
  };

  logout = async () => {
    return this.api.post("/auth/logout");
  };

  addProduct = async (payload: {
    productName: string;
    amount: number;
    cost: number;
  }) => {
    return this.api.post("/product", payload) as AxiosPromise<{
      productName: string;
      amount: number;
      cost: number;
    }>;
  };

  updateProduct = async (
    productId: number,
    payload: {
      productName: string;
      amount: number;
      cost: number;
    }
  ) => {
    return this.api.put(`/product/${productId}`, payload) as AxiosPromise<{
      productName: string;
      amount: number;
      cost: number;
    }>;
  };

  removeProduct = async (productId: number) => {
    return this.api.delete(`/product/${productId}`) as AxiosPromise;
  };
}

export default VendoApiClient;
