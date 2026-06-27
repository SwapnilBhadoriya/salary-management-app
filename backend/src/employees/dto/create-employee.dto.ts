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
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsNotPastDate } from '../../common/decorators/is-not-past-date.decorator';
import { EmploymentStatus } from '../enums/employment-status.enum';
import { EmploymentType } from '../enums/employment-type.enum';

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

  @IsNotEmpty()
  @IsEnum(EmploymentStatus)
  status: EmploymentStatus;

  @IsNotEmpty()
  @IsEnum(EmploymentType)
  type: EmploymentType;

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
