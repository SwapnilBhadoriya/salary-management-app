import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsUUID,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { EmploymentStatus } from '../enums/employment-status.enum';
import { EmploymentType } from '../enums/employment-type.enum';

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsNotEmpty()
  @IsEnum(EmploymentStatus)
  status: EmploymentStatus;

  @IsNotEmpty()
  @IsEnum(EmploymentType)
  type: EmploymentType;

  @IsOptional()
  @IsUUID()
  roleId?: string;

  @IsOptional()
  @IsUUID()
  countryId?: string;
}
