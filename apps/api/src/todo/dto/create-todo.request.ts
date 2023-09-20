import { IsString, MinLength } from 'class-validator';

export class CreateTodoRequest {
  @IsString()
  @MinLength(1)
  content: string;
}
