import { Embed } from "@features/db/entities/embed";
import { Model } from "@features/db/entities/model";
import { Project } from "@features/db/entities/project";
import { User } from "@features/db/entities/user";
import { injectRepository } from "@features/db/helpers";
import {
  checkBucketExists,
  checkFileExists,
  deleteBucket,
  deleteFile,
  ensureBucket,
  getUserModelBucketName,
  saveFileStream,
} from "@features/storage";
import { Readable } from "stream";
import { ReadableStream } from "stream/web";
import { test } from "vitest";

interface Fixtures {
  user: User;
  project: Project;
  embed: Embed;
  model: Model;
  file: File;
}

export const testWithFixtures = test.extend<Fixtures>({
  user: async ({}, use) => {
    const userRepository = await injectRepository(User);
    const projectRepository = await injectRepository(Project);
    const modelRepository = await injectRepository(Model);

    const user = await userRepository.save({
      id: "test",
      email: "test@test",
      picture: "https://test.com/test.jpg",
      projects: [],
      idAuth0: "test",
      enabled: true,
    });

    await use(user);

    await projectRepository.delete({ user: { id: user.id } });
    await modelRepository.delete({ user: { id: user.id } });

    await userRepository.delete({ id: "test" });
  },
  project: async ({ user }, use) => {
    const projectsRepository = await injectRepository(Project);

    const project = await projectsRepository.save({
      name: "Test Project",
      description: "This is a test project",
      user: { id: user.id },
    });

    await use(project);

    await projectsRepository.delete({
      id: project.id,
    });
  },

  model: async ({ user, file }, use) => {
    const modelRepository = await injectRepository(Model);

    const model = await modelRepository.save({
      name: "Test Model",
      coordinateSystem: "WGS84",
      user: { id: user.id },
    });

    const bucketName = getUserModelBucketName(user.id, model.id);
    await ensureBucket(bucketName);

    const fileStream = Readable.fromWeb(file.stream() as ReadableStream);
    await saveFileStream(file.name, bucketName, fileStream);

    await use(model);

    if (await checkBucketExists(bucketName)) {
      if (await checkFileExists(file.name, bucketName)) {
        await deleteFile(file.name, bucketName);
      }
      await deleteBucket(bucketName);
    }

    await modelRepository.delete({
      id: model.id,
    });
  },

  embed: async ({ project }, use) => {
    const embedRepository = await injectRepository(Embed);

    const embed = await embedRepository.save({
      project: { id: project.id },
    });

    await use(embed);

    await embedRepository.remove(embed);
  },

  file: async ({ user }, use) => {
    const dummyFile = {
      stream: () =>
        new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode("test"));
            controller.close();
          },
        }),
      name: "test.txt",
      size: 4,
      type: "text/plain",
    } as unknown as File;

    await use(dummyFile);
  },
});
