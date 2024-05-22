import { Column, Entity } from "typeorm";

@Entity()
export class User {
  @Column() id!: number;
  @Column() email!: string;
}
