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

export enum PaymentProviders {
  STRIPE = 'STRIPE',
  YOOKASSA = 'YOOKASSA',
  CRYPTOPAY = 'CRYPTOPAY',
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ enum: PaymentProviders, nullable: true })
  provider: PaymentProviders;

  @Column({ name: 'external_id', nullable: true })
  externalId: string;

  @Column('json', { nullable: true })
  metadata: Record<string, any>;

  @ManyToOne(() => User, (user) => user.payments, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Plan, (plan) => plan.payments, { onDelete: 'CASCADE' })
  plan: Plan;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
