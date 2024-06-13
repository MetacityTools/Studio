import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn() id!: string;

  @Column() email!: string;
  @Column({ nullable: true }) picture?: string;
  @Column({ default: false }) enabled!: boolean;
  @Column() idAuth0!: string;
}
