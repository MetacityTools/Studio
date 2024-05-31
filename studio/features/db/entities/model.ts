import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user";

@Entity("models")
export class Model {
  @PrimaryGeneratedColumn() id!: number;

  @Column() name!: string;
  @Column("varchar", { nullable: true }) coordinateSystem?: string | null;

  @ManyToOne(() => User, (user) => user.models, {
    nullable: false,
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  user?: User;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;

  // get from file system
  files?: string[];
}
