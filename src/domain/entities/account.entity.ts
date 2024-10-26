import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity('account')
export class Account {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column({ type: 'varchar', name: 'cuid', unique: true })
  cuid: string;

  @Column({ name: 'number', unique: true })
  number: string;

  @Column({ name: 'firstName', type: 'varchar' })
  firstName: string;

  @Column({ name: 'lastName', type: 'varchar' })
  lastName: string;

  @Column({ name: 'balance', type: 'float' })
  balance: number;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.accountFrom)
  transactionsFrom: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.accountTo)
  transactionsTo: Transaction[];
}
