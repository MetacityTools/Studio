"use client";

import { Grid, View } from "@adobe/react-spectrum";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { withUserEnabled } from "@core/utils/withUserEnabled";
import Header from "@features/projects/components/Header";
import ProjectList from "@features/projects/components/ProjectList";
import { ToastContainer } from "@react-spectrum/toast";

function ProjectListPage() {
  return (
    <Grid
      areas={{
        base: ["header", "projects"],
      }}
      width="100vw"
      gap="size-100"
    >
      <View gridArea="header">
        <Header
          nav={[
            {
              key: "projects",
              children: "Projects",
            },
          ]}
        />
      </View>
      <View
        gridArea="projects"
        position="relative"
        overflow="hidden"
        marginX="size-100"
      >
        <ProjectList />
      </View>
      <ToastContainer />
    </Grid>
  );
}

export default withPageAuthRequired(withUserEnabled(ProjectListPage));
