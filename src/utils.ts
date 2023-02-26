import { isAxiosError } from "axios";
import { toast } from "react-hot-toast";
export const formatChangeToText = (change: number[]) => {
  return `${change.join(" Cents, ")} Cents.`;
};

export const notifyError = (err: any) => {
  if (isAxiosError(err)) {
    toast.error(err.response?.data.message);
    return;
  }

  if (err instanceof Error) {
    toast.error(err.message);
    return;
  }

  toast.error("Something went wrong");
};
