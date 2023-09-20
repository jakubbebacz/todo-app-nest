import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoRequest } from './dto/create-todo.request';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  @Post()
  create(@Body(ValidationPipe) createTodoRequest: CreateTodoRequest) {
    return this.todoService.create(createTodoRequest);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.todoService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(+id);
  }
}
