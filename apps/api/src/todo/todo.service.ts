import { Injectable } from '@nestjs/common';
import { CreateTodoRequest } from './dto/create-todo.request';
import { TodoRepository } from './todo.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: TodoRepository,
  ) {}

  async findAll() {
    return this.todoRepository.find({
      where: { isDeleted: false },
    });
  }

  async create(req: CreateTodoRequest) {
    const todo = this.todoRepository.create({
      content: req.content,
      done: false,
      isDeleted: false,
    });

    return this.todoRepository.save(todo);
  }

  async update(id: number) {
    const todo = await this.todoRepository.findOne({
      where: { id: id },
    });

    todo.done = todo.done == false;

    return this.todoRepository.save(todo);
  }

  async remove(id: number) {
    const todo = await this.todoRepository.findOne({
      where: { id: id },
    });

    todo.isDeleted = true;
    return this.todoRepository.save(todo);
  }
}
