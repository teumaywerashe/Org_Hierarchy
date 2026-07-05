import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePositionDto {
  @ApiProperty({ example: 'CEO' })
  name: string;

  @ApiPropertyOptional({ example: 'Chief Executive Officer' })
  description?: string;

  @ApiPropertyOptional({ example: null })
  parentId?: string | null;
}
