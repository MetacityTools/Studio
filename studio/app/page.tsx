"use client";

import { Button, Flex } from "@adobe/react-spectrum";

export default function Home() {
  return (
    <Flex
      direction="column"
      width="100%"
      height="100%"
      maxWidth="size-6000"
      marginX="auto"
      gap="size-100"
      justifyContent="center"
      alignItems="center"
    >
      <h1>Metacity Studio</h1>
      <Button href="/secret" variant="accent" elementType="a">
        Log In
      </Button>
    </Flex>
  );
}
