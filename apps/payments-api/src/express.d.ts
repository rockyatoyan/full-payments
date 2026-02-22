import { User as TypeOrmUser } from '@/api/auth/entities/user.entity';

declare global {
  namespace Express {
    interface User extends TypeOrmUser {}
  }
}
