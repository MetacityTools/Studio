import {
  Icon as AdobeIcon,
  IconProps as AdobeIconProps,
} from "@adobe/react-spectrum";
import {
  enableCache,
  Icon as IconifyIcon,
  IconProps as IconifyIconProps,
} from "@iconify/react";
import { SVGProps } from "react";

// Enable caching in localStorage
enableCache("local");

export function Icon(props: IconifyIconProps) {
  return (
    <AdobeIcon>
      <IconifyIcon {...props} />
    </AdobeIcon>
  );
}

export type IconProps = Omit<AdobeIconProps, "children"> & {
  transform?: SVGProps<SVGSVGElement>["transform"];
};
