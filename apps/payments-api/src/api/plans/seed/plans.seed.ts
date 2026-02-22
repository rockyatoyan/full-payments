import { EntityManager } from 'typeorm';
import { Plan } from '../entities/plan.entity';

const plans: Omit<
  Plan,
  'id' | 'createdAt' | 'updatedAt' | 'subscriptions' | 'payments'
>[] = [
  {
    title: 'Basic Plan',
    description: 'A basic plan for individuals.',
    monthlyPrice: 10,
    yearlyPrice: 90,
  },
  {
    title: 'Pro Plan',
    description: 'A pro plan for professionals.',
    monthlyPrice: 20,
    yearlyPrice: 180,
  },
  {
    title: 'Enterprise Plan',
    description: 'An enterprise plan for businesses.',
    monthlyPrice: 50,
    yearlyPrice: 450,
  },
];

export const PlanSeed = async (manager: EntityManager) => {
  const entities = plans.map((plan) => {
    return manager.create(Plan, plan);
  });
  await manager.deleteAll(Plan);
  return manager.save(entities);
};
