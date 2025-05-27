import { IsString } from 'class-validator';

export class MessageDto {
  @IsString({ message: 'must be string' })
  message: string;
}
