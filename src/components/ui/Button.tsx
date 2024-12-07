import React from "react";
import { Button as BTN, ButtonProps } from "@nextui-org/react";

// interface btnProps extends ButtonProps {}

const Button: React.FC<ButtonProps> = (props) => {
  return <BTN {...props}>{props.children}</BTN>;
};

export default Button;
