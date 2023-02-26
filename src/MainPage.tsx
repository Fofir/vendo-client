import { FC } from "react";
import { UserRole } from "./VendoApiClient";

const BuyerApp: FC<{
  role?: UserRole;
}> = ({ role }) => {
  if (role === UserRole.SELLER) {
    return <div>SELLER APP</div>;
  }
  return <div>BUYER APP</div>;
};

export default BuyerApp;
