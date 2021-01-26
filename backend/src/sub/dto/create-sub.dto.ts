import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSubDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  title: string;

  @IsOptional()
  description: string;
}
