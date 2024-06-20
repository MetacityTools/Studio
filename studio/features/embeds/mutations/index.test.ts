import { expect, test } from "vitest";

import { Embed } from "@features/db/entities/embed";
import { Project } from "@features/db/entities/project";
import { injectRepository } from "@features/db/helpers";
import { getProjectEmbeds } from "@features/projects/queries/getProjectEmbeds";
import { getEmbed } from "../queries/getEmbed";
import { createEmbed } from "./createEmbed";
import { deleteEmbed } from "./deleteEmbed";

const embedFile = {
  stream: () =>
    new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("test"));
        controller.close();
      },
    }),
  name: "test.txt",
} as File;

test("embed CRUD", async () => {
  const projectRepository = await injectRepository(Project);

  const project = await projectRepository.save({
    name: "Test Project",
    description: "This is a test project",
  });

  let embed: Embed | null = null;

  // CREATE
  embed = await createEmbed(project.id, [embedFile]);

  // READ
  embed = await getEmbed(embed.id);
  expect(project).not.toBe(null);

  // READ FROM PROJECT
  embed = await getProjectEmbeds(project.id).then((embeds) => embeds[0]);
  expect(embed).not.toBe(null);

  // DELETE
  await deleteEmbed(embed!.id);
  expect(await getEmbed(embed!.id)).toBe(null);
});
