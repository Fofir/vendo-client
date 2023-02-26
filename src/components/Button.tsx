import React, { FC } from "react";
import cx from "classnames";

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button: FC<
  Props & {
    variant?: "primary" | "primary:inverted";
  }
> = ({ children, disabled, onClick, className, variant }) => {
  return (
    <button
      disabled={disabled}
      className={cx(
        "disabled:opacity-50 rounded px-4 ring-0 h-8",
        {
          "bg-vendo-primary text-white border-white border":
            !variant || variant === "primary",
          "bg-white text-vendo-primary border-vendo-primary border":
            variant === "primary:inverted",
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
