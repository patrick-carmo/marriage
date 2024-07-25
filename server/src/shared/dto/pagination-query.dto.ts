import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiProperty({
    description: 'Número da página',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'Limite de itens por página',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit?: number;
}
