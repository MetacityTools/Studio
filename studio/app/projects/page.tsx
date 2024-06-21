"use client";

import { Grid, View } from "@adobe/react-spectrum";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { withUserEnabled } from "@core/utils/withUserEnabled";
import ModelList from "@features/models/components/ModelList";
import Header from "@features/projects/components/Header";
import ProjectList from "@features/projects/components/ProjectList";
import { ToastContainer } from "@react-spectrum/toast";

function ProjectListPage() {
  return (
    <Grid
      areas={{
        base: ["header header", "projects models"],
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
        marginStart="size-100"
      >
        <ProjectList />
      </View>
      <View
        gridArea="models"
        position="relative"
        overflow="hidden"
        marginEnd="size-100"
      >
        <ModelList />
      </View>
      <ToastContainer />
    </Grid>
  );
}

export default withPageAuthRequired(withUserEnabled(ProjectListPage));
