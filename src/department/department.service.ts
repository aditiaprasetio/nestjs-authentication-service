import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './department.entity';
import {Employee} from '../employee/employee.entity';
import {In} from 'typeorm';

@Injectable()
export class DepartmentService extends TypeOrmCrudService<Department> {
  constructor(@InjectRepository(Department) repo) {
    super(repo);
  }
  async findByNames(names: string[]): Promise<Department[]> {
    try {
      if (names.length === 0) {
        return Promise.reject({
          statusCode: 400,
          message: 'Department name must be an array of string',
        });
      }
      const res = await this.repo.find({
        where: {name: In(names)},
        relations: [
          'groups',
          'areas',
          'areas.positions',
        ],
      });
      return res;
    } catch (err) {
      return Promise.reject(err);
    }
  }

}
