import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user";

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column() name!: string;
  @Column() description!: string;

  @ManyToOne(() => User, (user) => user.projects, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  user?: User;

  @CreateDateColumn() created_at!: Date;
  @UpdateDateColumn() updated_at!: Date;
}
