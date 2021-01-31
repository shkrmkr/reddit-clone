import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class VoteDto {
  @IsNotEmpty()
  identifier: string;

  @IsNotEmpty()
  slug: string;

  @IsOptional()
  @IsNotEmpty()
  commentIdentifier: string;

  @IsIn([-1, 1])
  value: number;
}
