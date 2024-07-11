import React from "react";

export interface ExampleReactComponentProps {
  mytitle: string | null;
  otherProp: string | null;
}

export default function ExampleReactComponent({
  mytitle,
  otherProp,
}: ExampleReactComponentProps) {
  return (
    <div>
      <h1>{mytitle}</h1>
    </div>
  );
}
