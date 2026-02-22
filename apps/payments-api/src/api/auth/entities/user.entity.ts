import { Payment } from '../../payments/entities/payment.entity'
import { Subscription } from '../../subsriptions/entities/subscription.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  isAllowedAutoRenewal: boolean;

  @OneToOne(() => Subscription, (subscription) => subscription.user, {
    nullable: true,
  })
  subscription: Subscription;

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
