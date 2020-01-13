import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Leave } from './leave.entity';
import { getConnection } from 'typeorm';

@Injectable()
export class LeaveService extends TypeOrmCrudService<Leave> {
  constructor(@InjectRepository(Leave) repo) {
    super(repo);
  }
  async validateAttendance(dto: Leave) {
    try {
      const queryBuilder: any = await this.repo.createQueryBuilder('leaves')
      .where('employee_id = :employee_id', { ...dto })
      .andWhere(`(IF(:date_start >= date_start AND :date_start <= date_end,'TRUE','FALSE')='TRUE'
      OR IF(:date_end >= date_start AND :date_end <= date_end,'TRUE','FALSE')='TRUE'
      OR IF(:date_start <= date_start AND :date_end >= date_end,'TRUE','FALSE')='TRUE')`, { ...dto });

      return await queryBuilder.getCount();
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
