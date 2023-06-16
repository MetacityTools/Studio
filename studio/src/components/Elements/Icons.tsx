import React from 'react';

interface IconProps {
    className?: string;
}

export function CubeEmpty(props: IconProps) {
    return (
        <svg
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            stroke="currentColor"
            fill="currentColor"
            height="1em"
            width="1em"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M 242.809 22.035 C 247.364 19.909 252.632 19.909 257.191 22.035 L 461.242 117.261 C 467.232 120.053 471.058 126.061 471.058 132.669 L 471.058 367.33 C 471.058 373.938 467.232 379.944 461.242 382.74 L 257.191 477.965 C 252.632 480.092 247.364 480.092 242.809 477.965 L 38.752 382.74 C 32.765 379.944 28.942 373.938 28.942 367.33 L 28.942 132.669 C 28.942 126.061 32.765 120.053 38.752 117.261 L 242.809 22.035 Z M 62.949 158.374 L 232.995 230.642 L 232.995 435.858 L 62.949 356.502 L 62.949 158.374 Z M 267.002 435.858 L 437.048 356.502 L 437.048 158.374 L 267.002 230.642 L 267.002 435.858 Z M 249.998 200.915 L 412.285 131.942 L 249.998 56.208 L 87.712 131.942 L 249.998 200.915 Z"
            />
        </svg>
    );
}

export function CubeLeft(props: IconProps) {
    return (
        <svg
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            fill="currentColor"
            height="1em"
            width="1em"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M 242.809 22.035 C 247.364 19.909 252.632 19.909 257.191 22.035 L 461.242 117.261 C 467.232 120.053 471.058 126.061 471.058 132.669 L 471.058 367.33 C 471.058 373.938 467.232 379.944 461.242 382.74 L 257.191 477.965 C 252.632 480.092 247.364 480.092 242.809 477.965 L 38.752 382.74 C 32.765 379.944 28.942 373.938 28.942 367.33 L 28.942 132.669 C 28.942 126.061 32.765 120.053 38.752 117.261 L 242.809 22.035 Z M 267.002 435.858 L 437.048 356.502 L 437.048 158.374 L 267.002 230.642 L 267.002 435.858 Z M 249.998 200.915 L 412.285 131.942 L 249.998 56.208 L 87.712 131.942 L 249.998 200.915 Z"
            />
        </svg>
    );
}

export function CubeRight(props: IconProps) {
    return (
        <svg
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            stroke="currentColor"
            fill="currentColor"
            height="1em"
            width="1em"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M 242.809 22.035 C 247.364 19.909 252.632 19.909 257.191 22.035 L 461.242 117.261 C 467.232 120.053 471.058 126.061 471.058 132.669 L 471.058 367.33 C 471.058 373.938 467.232 379.944 461.242 382.74 L 257.191 477.965 C 252.632 480.092 247.364 480.092 242.809 477.965 L 38.752 382.74 C 32.765 379.944 28.942 373.938 28.942 367.33 L 28.942 132.669 C 28.942 126.061 32.765 120.053 38.752 117.261 L 242.809 22.035 Z M 62.949 158.374 L 232.995 230.642 L 232.995 435.858 L 62.949 356.502 L 62.949 158.374 Z M 249.998 200.915 L 412.285 131.942 L 249.998 56.208 L 87.712 131.942 L 249.998 200.915 Z"
            />
        </svg>
    );
}

export function CubeTop(props: IconProps) {
    return (
        <svg
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            stroke="currentColor"
            fill="currentColor"
            height="1em"
            width="1em"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M 242.809 22.035 C 247.364 19.909 252.632 19.909 257.191 22.035 L 461.242 117.261 C 467.232 120.053 471.058 126.061 471.058 132.669 L 471.058 367.33 C 471.058 373.938 467.232 379.944 461.242 382.74 L 257.191 477.965 C 252.632 480.092 247.364 480.092 242.809 477.965 L 38.752 382.74 C 32.765 379.944 28.942 373.938 28.942 367.33 L 28.942 132.669 C 28.942 126.061 32.765 120.053 38.752 117.261 L 242.809 22.035 Z M 62.949 158.374 L 232.995 230.642 L 232.995 435.858 L 62.949 356.502 L 62.949 158.374 Z M 267.002 435.858 L 437.048 356.502 L 437.048 158.374 L 267.002 230.642 L 267.002 435.858 Z"
            />
        </svg>
    );
}

export function TriangleFull(props: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            stroke="currentColor"
            fill="currentColor"
            height="1em"
            width="1em"
            strokeWidth="2"
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
    );
}

export function TriangleFullFilled(props: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            stroke="currentColor"
            fill="currentColor"
            height="1em"
            width="1em"
            strokeWidth="2"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M10 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"></path>
            <path d="M3 17m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"></path>
            <path d="M17 17m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"></path>
            <path d="M6.5 17.1l5 -9.1"></path>
            <path d="M17.5 17.1l-5 -9.1"></path>
            <path d="M7 19l10 0"></path>
            <path d="M 6.667 16.345 C 6.667 16.345 7.254 18.203 7.254 18.209 C 7.254 18.215 16.812 18.323 16.812 18.323 L 17.348 15.947 L 12.631 7.449 L 11.036 7.572" />
        </svg>
    );
}

export function MouseLeft(props: IconProps) {
    return (
        <svg
            {...props}
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 16 16"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M 13 6.487 L 3 6.487 L 3 10.8 C 3 13.645 5.22 15.987 8 15.987 C 10.78 15.987 13 13.645 13 10.799 L 13 6.487 Z"
                style={{ fillOpacity: 0.3 }}
            ></path>
            <path
                d="M 8.5 0.013 L 8.5 5.487 L 13 5.487 L 13 5.175 C 13 2.502 11.042 0.273 8.5 0.013 Z"
                style={{ fillOpacity: 0.3 }}
            ></path>
            <path d="M 7.5 0.013 C 4.958 0.273 3 2.502 3 5.175 L 3 5.487 L 7.5 5.487 L 7.5 0.013 Z"></path>
        </svg>
    );
}

export function MouseRight(props: IconProps) {
    return (
        <svg
            {...props}
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 16 16"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M 13 6.487 L 3 6.487 L 3 10.8 C 3 13.645 5.22 15.987 8 15.987 C 10.78 15.987 13 13.645 13 10.799 L 13 6.487 Z"
                style={{ fillOpacity: 0.3 }}
            ></path>
            <path d="M 8.5 0.013 L 8.5 5.487 L 13 5.487 L 13 5.175 C 13 2.502 11.042 0.273 8.5 0.013 Z"></path>
            <path
                d="M 7.5 0.013 C 4.958 0.273 3 2.502 3 5.175 L 3 5.487 L 7.5 5.487 L 7.5 0.013 Z"
                style={{ fillOpacity: 0.3 }}
            ></path>
        </svg>
    );
}

export function MouseWheel(props: IconProps) {
    return (
        <svg
            {...props}
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 16 16"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M 13 6.487 L 3 6.487 L 3 10.8 C 3 13.645 5.22 15.987 8 15.987 C 10.78 15.987 13 13.645 13 10.799 L 13 6.487 Z"
                style={{ fillOpacity: 0.3 }}
            ></path>
            <path
                d="M 8.5 0.013 L 8.5 5.487 L 13 5.487 L 13 5.175 C 13 2.502 11.042 0.273 8.5 0.013 Z"
                style={{ fillOpacity: 0.3 }}
            ></path>
            <path
                d="M 7.5 0.013 C 4.958 0.273 3 2.502 3 5.175 L 3 5.487 L 7.5 5.487 L 7.5 0.013 Z"
                style={{ fillOpacity: 0.3 }}
            ></path>
        </svg>
    );
}
