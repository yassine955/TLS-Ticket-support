import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from "typeorm";

@Entity("settings")
export class Settings {
  @PrimaryColumn({ type: "varchar", length: 22 })
  guild!: string;

  @Column({ type: "text", default: "{}" })
  settings!: string;
}
