import { PlanSeed } from '../api/plans/seed/plans.seed';
import { AppDataSource } from './data-source';

const seed = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Start seeding the database...');

    await PlanSeed(AppDataSource.manager);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding the database:', error);
    process.exit(1);
  }
};

seed();
