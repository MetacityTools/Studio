import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryColumn() id!: string;

  @Column() email!: string;
  @Column({ nullable: true }) picture?: string;
}
