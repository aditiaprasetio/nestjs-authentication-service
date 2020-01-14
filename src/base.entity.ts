import { ApiModelProperty } from '@nestjs/swagger';
import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryColumn('varchar')
  id: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  @ApiModelProperty({ readOnly: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  @ApiModelProperty({ readOnly: true })
  updated_at?: Date;
}
