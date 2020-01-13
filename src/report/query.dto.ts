import { ApiModelProperty } from '@nestjs/swagger';

export class QueryReportCost {
  @ApiModelProperty()
  year: number;

  @ApiModelProperty()
  month: number;
}

export class QueryEmployeeLateMonthly {
  @ApiModelProperty()
  date: string;
}
export class QueryEmployeeLateWeekly {
  @ApiModelProperty()
  dateStart: string;

  @ApiModelProperty()
  dateEnd: string;
}
