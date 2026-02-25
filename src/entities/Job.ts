import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class Job {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  transcriptHash!: string;

  @Column("text")
  transcript!: string;

  @Column({
    type: "varchar",
    default: "processing",
  })
  status!: "processing" | "completed" | "failed";

  @Column({ type: "jsonb", nullable: true })
  result!: any;

  @CreateDateColumn()
  createdAt!: Date;
}
