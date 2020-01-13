import { Controller, HttpException, UseGuards } from '@nestjs/common';
import { Leave } from './leave.entity';
import { LeaveService } from './leave.service';
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

@Crud({
  model: {
    type: Leave,
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
  query: {
    join: {
      // tslint:disable-next-line: object-literal-key-quotes
      employee: {
        exclude: [],
      },
      'employee.group': {
        exclude: [],
      },
      'employee.department': {
        exclude: [],
      },
      'employee.area': {
        exclude: [],
      },
      'employee.position': {
        exclude: [],
      },
    },
  },
})
@ApiUseTags('Leaves')
@Controller('leaves')
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class LeaveController implements CrudController<Leave> {
  constructor(public service: LeaveService) {}

  get base(): CrudController<Leave> {
    return this;
  }

  // @Roles('admin', 'hr')
  @Override()
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @Override('getOneBase')
  getOneAndDoStuff(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @Override()
  async createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Leave) {
    // TODO: validate leave input before insert to db
    const count: any = await this.service.validateAttendance(dto);
    if (Number(count) === 0) {
      return this.base.createOneBase(req, dto);
    } else {
      throw new HttpException('Duplicate value', 409);
    }
  }

  @Override()
  createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<Leave>,
  ) {
    return this.base.createManyBase(req, dto);
  }

  @Override('updateOneBase')
  coolFunction(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Leave) {
    return this.base.updateOneBase(req, dto);
  }

  @Override('replaceOneBase')
  awesomePUT(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Leave) {
    return this.base.replaceOneBase(req, dto);
  }

  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }
}
