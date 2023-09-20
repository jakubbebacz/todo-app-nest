import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from '../todo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from '../entities/todo.entity';
import { ConfigService } from '@nestjs/config';
import { TodoRepository } from '../todo.repository';
import { DataSource } from 'typeorm';

class MockDataSource {
  createEntityManager() {
    return {};
  }
}

describe('TodoService', () => {
  let todoService: TodoService;
  let todoRepository: TodoRepository;

  const todoRepositoryToken = getRepositoryToken(Todo);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        ConfigService,
        {
          provide: todoRepositoryToken,
          useClass: TodoRepository,
        },
        {
          provide: DataSource,
          useClass: MockDataSource,
        },
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
    todoRepository = module.get<TodoRepository>(todoRepositoryToken);
  });

  it('should be defined', () => {
    expect(todoService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all todos', async () => {
      const todoList: Todo[] = [
        { id: 1, content: 'Write tests', done: false, isDeleted: false },
      ];

      jest.spyOn(todoRepository, 'find').mockResolvedValueOnce(todoList);
      const result = await todoService.findAll();
      expect(result).toEqual(todoList);
    });
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const createTodoRequest = { content: 'New Task' };
      const createTodoData = {
        ...createTodoRequest,
        done: false,
        isDeleted: false,
      };
      const createdTodo = {
        id: 1,
        ...createTodoRequest,
        done: false,
        isDeleted: false,
      };

      jest.spyOn(todoRepository, 'create').mockReturnValue(createdTodo);
      jest.spyOn(todoRepository, 'save').mockResolvedValue(createdTodo);

      const result = await todoService.create(createTodoRequest);

      expect(result).toEqual(createdTodo);
      expect(todoRepository.create).toHaveBeenCalledWith(createTodoData);
      expect(todoRepository.save).toHaveBeenCalledWith(createdTodo);
    });
  });

  describe('update', () => {
    it('should update the status of a todo', async () => {
      const todoId = 1;
      const existingTodo = {
        id: todoId,
        content: 'New Task',
        done: false,
        isDeleted: false,
      };

      jest.spyOn(todoRepository, 'findOne').mockResolvedValue(existingTodo);
      jest.spyOn(todoRepository, 'save').mockResolvedValue(existingTodo);

      const result = await todoService.update(todoId);

      expect(result).toEqual({ ...existingTodo, done: true });
      expect(todoRepository.findOne).toHaveBeenCalledWith({
        where: { id: todoId },
      });
      expect(todoRepository.save).toHaveBeenCalledWith({
        ...existingTodo,
        done: true,
      });
    });
  });

  describe('remove', () => {
    it('should mark a todo as deleted', async () => {
      const todoId = 1;
      const existingTodo = {
        id: todoId,
        content: 'Task 1',
        done: false,
        isDeleted: false,
      };

      jest.spyOn(todoRepository, 'findOne').mockResolvedValue(existingTodo);
      jest.spyOn(todoRepository, 'save').mockResolvedValue(existingTodo);

      const result = await todoService.remove(todoId);

      expect(result).toEqual({ ...existingTodo, isDeleted: true });
      expect(todoRepository.findOne).toHaveBeenCalledWith({
        where: { id: todoId },
      });
      expect(todoRepository.save).toHaveBeenCalledWith({
        ...existingTodo,
        isDeleted: true,
      });
    });
  });
});
