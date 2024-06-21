"use client";

import { Flex, Grid, View } from "@adobe/react-spectrum";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { ContentContainer } from "@core/components/ContentContainer";
import { withUserEnabled } from "@core/utils/withUserEnabled";
import ModelList from "@features/models/components/ModelList";
import Header from "@features/projects/components/Header";
import ProjectList from "@features/projects/components/ProjectList";
import { ToastContainer } from "@react-spectrum/toast";

function ProjectListPage() {
  return (
    <Grid
      areas={{
        base: ["header", "content"],
      }}
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
      <View gridArea="content">
        <ContentContainer>
          <Flex
            gap="size-100"
            width="100%"
            UNSAFE_style={{
              paddingLeft: "10px",
              paddingRight: "10px",
              boxSizing: "border-box",
            }}
          >
            <ProjectList />
            <ModelList />
          </Flex>
        </ContentContainer>
        <ToastContainer />
      </View>
    </Grid>
  );
}

export default withPageAuthRequired(withUserEnabled(ProjectListPage));
