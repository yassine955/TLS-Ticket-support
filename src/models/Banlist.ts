import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("banlist")
export class Banlist {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 22 })
  guild!: string;

  @Column({ type: "varchar", length: 25 })
  member!: string;

  @Column({ type: "text" })
  reason!: string;
}
