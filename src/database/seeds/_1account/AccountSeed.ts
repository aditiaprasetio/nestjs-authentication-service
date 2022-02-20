import { encryptPassword } from '../../../utils/encrypt';

export const SeedData: any[] = [
  {
    id: '2255a2cf-6e3d-4188-b552-2117b4a40e6d',
    first_name: 'Super',
    last_name: 'Administrator',
    email: 'super@admin.com',
    username: 'superadmin',
    password: encryptPassword(process.env.DEFAULT_ACCOUNT_PASSWORD),
    avatar: '',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'ec8212cb-cb66-4237-8eb1-f5e331dd68b2',
    first_name: 'Admin',
    last_name: 'Istrator',
    email: 'admin@admin.com',
    username: 'admin',
    password: encryptPassword(process.env.DEFAULT_ACCOUNT_PASSWORD),
    avatar: '',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'b4634599-f590-4725-a5fe-9f31f21c6505',
    first_name: 'User',
    last_name: 'User',
    email: 'user@user.com',
    username: 'user',
    password: encryptPassword(process.env.DEFAULT_ACCOUNT_PASSWORD),
    avatar: '',
    created_at: new Date(),
    updated_at: new Date(),
  },
];