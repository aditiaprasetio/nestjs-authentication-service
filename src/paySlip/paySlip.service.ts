import { Injectable, HttpException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaySlip} from './paySlip.entity';
import { CrudRequest, CreateManyDto } from '@nestjsx/crud';
import { LogService } from '../log/log.service';
import { ENTITIES } from '../utils/constants';
import { Loan } from '../loan/loan.entity';
import { Repository, getConnection } from 'typeorm';
import { ELoanType } from '../loan/loan.enum';
import { calculateLoan } from '../utils/loanCalculator';

@Injectable()
export class PaySlipService extends TypeOrmCrudService<PaySlip> {
  constructor(@InjectRepository(PaySlip) repo,
              @InjectRepository(Loan)
              private readonly loanRepo: Repository<Loan>,
              private readonly logService: LogService) {
    super(repo);
  }

  async customCreateMany(dto: CreateManyDto<PaySlip>, additionalData: any): Promise<any> {
    try {
      let queryBuilder: any = await this.repo.createQueryBuilder('payslips');
      for (const data of dto.bulk) {
        queryBuilder = await queryBuilder.orWhere(`employee_id = :employee_id AND DATE(start_at) <= :start_at AND DATE(end_at) >= :end_at`, { ...data });
      }
      const isPayslipExists = await queryBuilder.getMany();
      if (isPayslipExists.length === 0) {

        const res = {
          payslips: [],
          loans: [],
        };
        await getConnection().transaction(async transactionalEntityManager => {
          for (const data of dto.bulk) {
            const tmpData: any = {...data};
            const tmpDataPayslipCreated: PaySlip = await this.repo.create(data);
            const tmpDataPayslipSaved = await transactionalEntityManager.save(tmpDataPayslipCreated);
            res.payslips.push(tmpDataPayslipSaved);

            const latestLoanPay: any = await this.loanRepo.findOne({
              where: {
                employee_id: data.employee_id,
              },
              order: {
                created_at: 'DESC',
              },
            });
            let tmpDataLoan: Partial<Loan> = {
              employee_id: tmpData.employee_id,
              created_by_id: additionalData.accountId,
              type: ELoanType.PAY,
              loan_date: new Date(),
              nominal: tmpData.meta ? tmpData.meta.payslip.value_bon_deduction : 0,
            };
            const loanPayData = await calculateLoan(latestLoanPay, ELoanType.PAY, tmpDataLoan.nominal);
            tmpDataLoan = {
              ...tmpDataLoan,
              ...loanPayData,
            };
            if (tmpDataLoan.nominal > 0) {
              const tmpDataLoanCreated: Loan = await this.loanRepo.create(tmpDataLoan);
              const tmpDataLoanSaved = await transactionalEntityManager.save(tmpDataLoanCreated);
              res.loans.push(tmpDataLoanSaved);
            }
          }
        });

        return res;
      } else {
        throw new HttpException({
          message: 'Ada payslip yang sudah pernah di generate.',
          data: {
            payslips: isPayslipExists,
            // loans: isLoanExists,
          },
        }, 409);
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async customUpdateOne(req: CrudRequest, dto: PaySlip, additionalData: any): Promise<PaySlip> {
    const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
    const oldData = await super.findOne(filterId.value);
    const res: PaySlip = await super.updateOne(req, dto);
    const newData = await super.findOne(filterId.value);

    const changeDetail = await this.getChangeDetail(oldData, newData);

    if (changeDetail.isAnyChange) {
      await this.logService.create({
        entity: ENTITIES.payslip,
        action: 'UPDATE',
        account_id: additionalData.accountId,
        meta: {
          previous_data: changeDetail.oldData,
          current_data: changeDetail.newData,
        },
      });
    }
    return res;
  }

  async customReplaceOne(req: CrudRequest, dto: PaySlip, additionalData: any): Promise<PaySlip> {
    const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
    const oldData: any = await super.findOne(filterId.value);
    const res: PaySlip = await super.replaceOne(req, dto);
    const newData: any = await super.findOne(filterId.value);

    const changeDetail = await this.getChangeDetail(oldData, newData);

    if (changeDetail.isAnyChange) {
      await this.logService.create({
        entity: ENTITIES.payslip,
        action: 'UPDATE',
        account_id: additionalData.accountId,
        meta: {
          previous_data: changeDetail.oldData,
          current_data: changeDetail.newData,
        },
      });
    }
    return res;
  }

  async customDeleteOne(req: CrudRequest, additionalData: any): Promise<any> {
    const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
    const oldData = await super.findOne(filterId.value);
    const res: any = await super.deleteOne(req);
    await this.logService.create({
      entity: ENTITIES.payslip,
      action: 'DELETE',
      account_id: additionalData.accountId,
      meta: {
        previous_data: oldData,
        current_data: null,
      },
    });
    return res;
  }

  async getChangeDetail(oldData: any, newData: any): Promise<any> {
    let isAnyChange: boolean = false;
    if (oldData.meta && newData.meta) {
      const keys = await Object.keys(oldData.meta.payslip);
      for (const key of keys) {
        if (typeof oldData.payslip_meta[key] === 'object') {
          const metaKeys = await Object.keys(oldData.payslip_meta[key]);
          for (const metaKey of metaKeys) {
            if (oldData.payslip_meta[key][metaKey] !== newData.payslip_meta[key][metaKey]) {
              isAnyChange = true;
            }
          }
        } else if (oldData.payslip_meta[key] !== newData.payslip_meta[key]) {
          isAnyChange = true;
        }
      }
    }

    return {
      isAnyChange,
      oldData,
      newData,
    };
  }
}
