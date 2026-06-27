import { IsNumber, IsPositive, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsNotPastDate } from '../../common/decorators/is-not-past-date.decorator';

export class CreateSalaryRecordDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @Type(() => Date)
  @IsDate()
  @IsNotPastDate()
  effectiveDate: Date;
}
