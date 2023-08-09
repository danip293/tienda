import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  Entity,
} from 'typeorm';

export class Change {
  fieldName: string;
  previous: string;
  current: string;
}

@Entity()
export class Audit {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  date: any;
  @Column({ type: 'json' })
  changes: Change[];
}
