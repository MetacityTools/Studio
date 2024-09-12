import { IconProps as AdobeIconProps } from "@adobe/react-spectrum";
import { SVGProps } from "react";

export type IconProps = Omit<AdobeIconProps, "children"> & {
  transform?: SVGProps<SVGSVGElement>["transform"];
};
