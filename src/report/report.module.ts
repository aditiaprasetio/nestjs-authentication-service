import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaySlip } from '../paySlip/paySlip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaySlip])],
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportModule { }
