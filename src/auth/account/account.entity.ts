import {
  Entity,
  Column,
  BeforeInsert,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../base.entity';
import uuid = require('uuid');
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsString } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { Type } from 'class-transformer';
import { AccountRole } from '../accountRole/accountRole.entity';
import { AccountPermission } from '../accountPermission/accountPermission.entity';
import { encryptPassword } from '../../utils/encrypt';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('accounts')
export class Account extends BaseEntity {
  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column()
  first_name: string;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ nullable: true })
  last_name?: string;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ nullable: true })
  avatar?: string;

  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ unique: true })
  username: string;

  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ unique: true })
  email: string;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ nullable: true })
  branch_id: string;

  @OneToMany(() => AccountRole, account_role => account_role.account)
  @Type(() => AccountRole)
  account_roles: AccountRole[];

  @OneToMany(
    () => AccountPermission,
    account_permission => account_permission.account,
  )
  @Type(() => AccountPermission)
  account_permissions: AccountPermission[];

  @BeforeInsert()
  hashPassword() {
    this.password = encryptPassword(this.password);
  }
  @ApiModelProperty()
  @Column()
  password: string;

  @ApiModelPropertyOptional()
  @Column({ nullable: true })
  token_reset_password?: string | null;

  @ApiModelPropertyOptional({ example: false })
  @Column({ default: false })
  is_disabled?: boolean;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
    this.email = this.email.toLowerCase().trim();
    this.username = this.username.toLowerCase().trim();
  }
}
