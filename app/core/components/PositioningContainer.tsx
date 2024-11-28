import { Grid, View } from "@adobe/react-spectrum";

export function PositioningContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Grid
      areas={{
        base: ["content"],
      }}
      width="100%"
      height="100%"
      gap="size-100"
    >
      <View
        gridArea="content"
        position="relative"
        overflow="hidden"
        width="100%"
        height="100%"
      >
        {children}
      </View>
    </Grid>
  );
}
