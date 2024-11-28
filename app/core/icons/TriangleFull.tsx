import { Icon as AdobeIcon } from "@adobe/react-spectrum";
import { IconProps } from "./Icon";

export function TriangleFull(props: IconProps) {
  const { transform, ...rest } = props;
  return (
    <AdobeIcon {...rest}>
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        fill="currentColor"
        height="1em"
        width="1em"
        strokeWidth="2"
        transform={transform}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path
          fill="none"
          d="M10 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"
        ></path>
        <path
          fill="none"
          d="M3 17m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"
        ></path>
        <path
          fill="none"
          d="M17 17m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"
        ></path>
        <path d="M6.5 17.1l5 -9.1"></path>
        <path d="M17.5 17.1l-5 -9.1"></path>
        <path d="M7 19l10 0"></path>
        <path d="M 6.667 16.345 C 6.667 16.345 7.254 18.203 7.254 18.209 C 7.254 18.215 16.812 18.323 16.812 18.323 L 17.348 15.947 L 12.631 7.449 L 11.036 7.572" />
      </svg>
    </AdobeIcon>
  );
}
