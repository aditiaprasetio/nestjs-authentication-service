import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  QueryReportCost,
  QueryEmployeeLateWeekly,
  QueryEmployeeLateMonthly,
} from './query.dto';
import { Repository } from 'typeorm';
import { PaySlip } from '../paySlip/paySlip.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(PaySlip)
    private readonly payslipRepository: Repository<PaySlip>,
  ) {}

  async getMostLateEmployeeMonthly(query: QueryEmployeeLateMonthly) {
    try {
      const date = query.date.split('-');
      const month: number = Number(date[1]);
      const year: number = Number(date[0]);

      const queryBuilder: any = await this.payslipRepository
        .createQueryBuilder('payslip')
        .select('payslip.id', 'id')
        .addSelect('payslip.created_at', 'created_at')
        .addSelect(
          `payslip.payslip_meta ->> '$.attendance_calculation.durasi_terlambat'`,
          'late_duration',
        )
        .addSelect(
          `payslip.payslip_meta ->> '$.attendance_calculation.durasi_izin'`,
          'leave_duration',
        )
        .addSelect(
          `payslip.payslip_meta ->> '$.attendance_calculation.durasi_terlambat' + payslip.payslip_meta ->> '$.attendance_calculation.durasi_izin'`,
          'total',
        )
        .leftJoin('payslip.employee', 'employee')
        .addSelect(`employee.name`, 'name')
        .addSelect(`employee.id`, 'employee_id')
        .leftJoin('employee.department', 'department')
        .addSelect('department.name', 'department_name')
        .addSelect(`department.meta ->> '$.payslip_filter'`, 'payslip_filter')
        .where(`department.meta -> '$.payslip_filter' = 2`)
        .andWhere(`MONTH(payslip.created_at) = :month`, { month })
        .andWhere(`YEAR(payslip.created_at) = :year`, { year })
        .orderBy(`total`, 'DESC')
        // .orderBy(
        //   `payslip.payslip_meta ->> '$.attendance_calculation.durasi_terlambat'`,
        //   'DESC',
        // )
        // .addOrderBy(
        //   `payslip.payslip_meta ->> '$.attendance_calculation.durasi_izin'`,
        //   'DESC',
        // )
        .limit(10);
      const res = await queryBuilder.execute();

      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getMostLateEmployeeWeekly(query: QueryEmployeeLateWeekly) {
    try {
      const start = query.dateStart.slice(0, 23);
      const end = query.dateEnd.slice(0, 23);
      const queryBuilder: any = await this.payslipRepository
        .createQueryBuilder('payslip')
        .select('payslip.id', 'id')
        .addSelect('payslip.created_at', 'created_at')
        .addSelect(
          `payslip.payslip_meta ->> '$.attendance_calculation.durasi_terlambat'`,
          'late_duration',
        )
        .addSelect(
          `payslip.payslip_meta ->> '$.attendance_calculation.durasi_izin'`,
          'leave_duration',
        )
        .addSelect(
          `payslip.payslip_meta ->> '$.attendance_calculation.durasi_terlambat' + payslip.payslip_meta ->> '$.attendance_calculation.durasi_izin'`,
          'total',
        )
        .leftJoin('payslip.employee', 'employee')
        .addSelect(`employee.name`, 'name')
        .addSelect(`employee.id`, 'employee_id')
        .leftJoin('employee.department', 'department')
        .addSelect('department.name', 'department_name')
        .addSelect(`department.meta ->> '$.payslip_filter'`, 'payslip_filter')
        .where(`department.meta -> '$.payslip_filter' = 1`)
        .andWhere(`payslip.created_at BETWEEN :start AND :end`, { start, end })
        .orderBy(`total`, 'DESC')
        // .addOrderBy(
        //   `payslip.payslip_meta ->> '$.attendance_calculation.durasi_izin'`,
        //   'DESC',
        // )
        .limit(10);
      const res = await queryBuilder.execute();

      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getTotalCost(query: QueryReportCost) {
    try {
      const queryBuilderCurrent = await this.payslipRepository
        .createQueryBuilder('payslips')
        .select('SUM(payslips.total)', 'sum_total')
        .where(
          '(MONTH(start_at) = :month AND YEAR(start_at) = :year) OR (MONTH(end_at) = :month AND YEAR(end_at) = :year)',
          { month: query.month, year: query.year },
        );
      let month_before;
      let year_before;
      if (Number(query.month) === 1) {
        month_before = 12;
        year_before = Number(query.year) - 1;
      } else {
        month_before = Number(query.month) - 1;
        year_before = Number(query.year);
      }
      const queryBuilderBefore = await this.payslipRepository
        .createQueryBuilder('payslips')
        .select('SUM(payslips.total)', 'sum_total')
        .where(
          '(MONTH(start_at) = :month AND YEAR(start_at) = :year) OR (MONTH(end_at) = :month AND YEAR(end_at) = :year)',
          { month: month_before, year: year_before },
        );
      const resCurrent: any = await queryBuilderCurrent.execute();
      const resBefore: any = await queryBuilderBefore.execute();
      return {
        current_year: Number(query.year),
        current_month: Number(query.month),
        current_total: resCurrent[0].sum_total,
        before_year: Number(year_before),
        before_month: Number(month_before),
        before_total: resBefore[0].sum_total,
      };
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
