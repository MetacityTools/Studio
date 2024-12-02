import { Icon as AdobeIcon } from "@adobe/react-spectrum";
import { IconProps } from "./Icon";

export function CubeEmpty(props: IconProps) {
  const { transform, ...rest } = props;
  return (
    <AdobeIcon {...rest}>
      <svg
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        fill="currentColor"
        height="1em"
        width="1em"
        scale={transform}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M 242.809 22.035 C 247.364 19.909 252.632 19.909 257.191 22.035 L 461.242 117.261 C 467.232 120.053 471.058 126.061 471.058 132.669 L 471.058 367.33 C 471.058 373.938 467.232 379.944 461.242 382.74 L 257.191 477.965 C 252.632 480.092 247.364 480.092 242.809 477.965 L 38.752 382.74 C 32.765 379.944 28.942 373.938 28.942 367.33 L 28.942 132.669 C 28.942 126.061 32.765 120.053 38.752 117.261 L 242.809 22.035 Z M 62.949 158.374 L 232.995 230.642 L 232.995 435.858 L 62.949 356.502 L 62.949 158.374 Z M 267.002 435.858 L 437.048 356.502 L 437.048 158.374 L 267.002 230.642 L 267.002 435.858 Z M 249.998 200.915 L 412.285 131.942 L 249.998 56.208 L 87.712 131.942 L 249.998 200.915 Z"
        />
      </svg>
    </AdobeIcon>
  );
}
