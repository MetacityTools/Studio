import { expect } from "vitest";

import { createEmbed } from "@features/embeds/mutations/createEmbed";
import { deleteEmbed } from "@features/embeds/mutations/deleteEmbed";
import { getEmbed } from "@features/embeds/queries/getEmbed";
import { getProjectEmbeds } from "@features/projects/queries/getProjectEmbeds";
import { testWithFixtures } from "./helpers";

testWithFixtures("create embed", async ({ project, file }) => {
  const result = await createEmbed(project.id, [file]);
  expect(result).not.toBe(null);
});

testWithFixtures("get embed", async ({ embed }) => {
  const result = await getEmbed(embed.id);
  expect(result).not.toBe(null);
});

testWithFixtures("get project embeds", async ({ embed }) => {
  const result = await getProjectEmbeds(embed.project!.id).then(
    (embeds) => embeds[0],
  );
  expect(result).not.toBe(null);
});

testWithFixtures("delete embed", async ({ embed }) => {
  await deleteEmbed(embed!.id);
  expect(await getEmbed(embed!.id)).toBe(null);
});
