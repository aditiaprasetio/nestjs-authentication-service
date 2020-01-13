import { Controller, UseGuards, Req, Request, HttpException } from '@nestjs/common';
import { PaySlip } from './paySlip.entity';
import { PaySlipService } from './paySlip.service';
import { RolesGuard } from '../auth/role/roles.guard';
import { Roles } from '../auth/role/role.decorator';
import {
  Crud,
  CrudController,
  Override,
  ParsedRequest,
  CrudRequest,
  ParsedBody,
  CreateManyDto,
} from '@nestjsx/crud';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { getAccountId } from '../utils/auth';

@Crud({
  model: {
    type: PaySlip,
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
})
@ApiUseTags('PaySlips')
@Controller('payslips')
// @UseGuards(RolesGuard)
@ApiBearerAuth()
export class PaySlipController implements CrudController<PaySlip> {
  constructor(public service: PaySlipService) {}

  get base(): CrudController<PaySlip> {
    return this;
  }

  @Roles('admin')
  @Override()
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @Override('getOneBase')
  getOneAndDoStuff(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @Override()
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: PaySlip) {
    return this.base.createOneBase(req, dto);
  }

  @Override()
  async createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<PaySlip>,
    @Req() request: Request,
  ) {
    try {
      const accountId = await getAccountId((request.headers as any).authorization);
      return this.service.customCreateMany(dto, { accountId });
    } catch (err) {
      throw new HttpException(err.message || JSON.stringify(err), err.status || err.statusCode || 500);
    }
  }

  @Override()
  async updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: PaySlip, @Req() request: Request) {
    const accountId = await getAccountId((request.headers as any).authorization);
    return await this.service.customUpdateOne(req, dto, {accountId});
  }

  @Override()
  async replaceOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: PaySlip, @Req() request: Request) {
    const accountId = await getAccountId((request.headers as any).authorization);
    return await this.service.customReplaceOne(req, dto, {accountId});
  }

  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest, @Req() request: Request) {
    const accountId = await getAccountId((request.headers as any).authorization);
    return await this.service.customDeleteOne(req, {accountId});
  }
}
