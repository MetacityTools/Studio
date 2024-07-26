"use client";

import { Grid, Heading, View } from "@adobe/react-spectrum";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

function UserNotEnabledPage() {
  return (
    <Grid
      width="100%"
      height="100%"
      gap="size-100"
      justifyContent="start"
      alignItems="start"
    >
      <View marginX="size-100">
        <Heading level={1}>User Not Enabled</Heading>

        <p>
          Your account has not been enabled. Please contact an administrator at{" "}
          <a href="mailto:vojta@stdio.cz">vojta@stdio.cz</a>
        </p>
      </View>
    </Grid>
  );
}

export default withPageAuthRequired(UserNotEnabledPage);
