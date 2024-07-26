"use client";

import { Button, Grid, Heading, View } from "@adobe/react-spectrum";
import Link from "next/link";

export default function Home() {
  return (
    <Grid
      width="100%"
      height="100%"
      gap="size-100"
      justifyContent="start"
      alignItems="start"
    >
      <View marginX="size-100">
        <Heading level={1}>Metacity Studio</Heading>
        <Button
          href="/projects"
          variant="accent"
          style="outline"
          elementType={Link}
        >
          Log In
        </Button>
      </View>
    </Grid>
  );
}
