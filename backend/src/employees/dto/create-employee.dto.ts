import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsUUID,
  IsNumber,
  IsPositive,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsNotPastDate } from '../../common/decorators/is-not-past-date.decorator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  @IsEmail()
  email: string;

  @IsUUID()
  departmentId: string;

  @IsUUID()
  roleId: string;

  @IsUUID()
  countryId: string;

  @IsNumber()
  @IsPositive()
  salary: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @IsNotPastDate()
  effectiveDate?: Date;
}
