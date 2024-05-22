import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Project } from "./project";

@Entity()
export class User {
  @PrimaryColumn() id!: string;
  @Column() email!: string;

  @OneToMany(() => Project, (project) => project.user)
  projects!: Project[];
}
