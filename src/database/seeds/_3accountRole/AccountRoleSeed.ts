import { SeedData as AccountData } from '../_1account/AccountSeed';
import { SeedData as RoleData } from '../_2role/RoleSeed';
import * as uuid from 'uuid';

export const SeedData: any[] = AccountData.map((item: any, index: number) => {
  return {
    id: uuid.v4(),
    account_id: item.id,
    role_id: RoleData[index].id,
    created_at: new Date(),
    updated_at: new Date(),
  };
});
