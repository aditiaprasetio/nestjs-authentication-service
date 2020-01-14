import { ROLES } from '../../../auth/auth.constant';

export const SeedData: any[] = [
  {
    id: '7b47ec41-e861-42e0-b787-b5396f825622',
    name: ROLES.SUPERADMIN,
    description: 'Super Administrator',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '04558fec-bcad-48f6-bf09-33a287f10c0c',
    name: ROLES.ADMIN,
    description: 'Administrator',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '7b47ec41-e861-42e0-b787-b5396f825622',
    name: ROLES.USER,
    description: 'User',
    created_at: new Date(),
    updated_at: new Date(),
  },
];
