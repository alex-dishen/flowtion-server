import { IsNumber } from 'class-validator';
import { IsOptional } from 'class-validator';
import IsNullOrNumberDecorator from '../decorators/is-number-or-null.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  take?: number;
}

export class PaginationMetadata {
  @IsNumber()
  total: number;

  @IsNumber()
  lastPage: number;

  @IsNumber()
  currentPage: number;

  @IsNumber()
  perPage: number;

  @IsNullOrNumberDecorator({ message: 'Must be integer or null' })
  prev: number | null;

  @IsNullOrNumberDecorator({ message: 'Must be integer or null' })
  next: number | null;
}

export class PaginatedResult<T> {
  @ApiProperty({ isArray: true })
  data: T[];
  meta: PaginationMetadata;
}

export type PaginateOptions = { skip?: number; take?: number };
