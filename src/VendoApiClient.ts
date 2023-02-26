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

export type Product = {
  id: number;
  cost: number;
  productName: string;
  amountAvailable: number;
};

export type ProductPayload = Omit<Product, "id">;

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

  buy = async (payload: { productId: number; amount: number }) => {
    const response = await this.api.post<
      any,
      AxiosResponse<{
        change: number[];
        productName: string;
        spent: number;
      }>
    >("/buy", payload);

    return response.data;
  };

  getProducts = async () => {
    const response = await this.api.get<any, AxiosResponse<Product[]>>(
      "/products"
    );

    return response.data;
  };

  addProduct = async (payload: ProductPayload) => {
    const response = await this.api.post<any, AxiosResponse<Product>>(
      "/product",
      payload
    );
    return response.data;
  };

  updateProduct = async (productId: number, payload: ProductPayload) => {
    const response = await this.api.put<any, AxiosResponse<Product>>(
      `/product/${productId}`,
      payload
    );

    return response.data;
  };

  removeProduct = async (productId: number) => {
    return this.api.delete(`/product/${productId}`) as AxiosPromise;
  };

  deposit = async (denomination: number) => {
    const response = await this.api.post<
      any,
      AxiosResponse<{
        deposit: number;
      }>
    >("/deposit", {
      deposit: denomination,
    });

    return response.data;
  };
}

export default VendoApiClient;
