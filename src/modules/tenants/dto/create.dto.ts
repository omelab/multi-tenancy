import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTenantDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  subdomain: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  dbName: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  dbUsername: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  dbPassword: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  dbHost: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  dbPort: number;
}
