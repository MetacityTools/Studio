import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Project {
  // id
  // name
  // description
  // created_at
  // updated_at
  // user_id -> User.id

  @PrimaryGeneratedColumn()
  id!: number;

  @Column() name!: string;
  @Column() description!: string;
  @CreateDateColumn() created_at!: Date;
  @UpdateDateColumn() updated_at!: Date;
}
