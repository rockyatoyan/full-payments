import { User } from '../../auth/entities/user.entity';
import { Plan } from '../../plans/entities/plan.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PaymentProvider {
  STRIPE = 'STRIPE',
  YOOKASSA = 'YOOKASSA',
  CRYPTOPAY = 'CRYPTOPAY',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum BilligPeriod {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ enum: PaymentProvider, nullable: true })
  provider: PaymentProvider;

  @Column({ name: 'external_id', nullable: true })
  externalId: string;

  @Column('json', { nullable: true })
  metadata: Record<string, any>;

  @Column({ enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ enum: BilligPeriod, nullable: true })
  billingPeriod: BilligPeriod;

  @ManyToOne(() => User, (user) => user.payments, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Plan, (plan) => plan.payments, { onDelete: 'CASCADE' })
  plan: Plan;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
