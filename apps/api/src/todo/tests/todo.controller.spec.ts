import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CreateTodoRequest } from '../dto/create-todo.request';
import { TodoService } from '../todo.service';
import { TodoController } from '../todo.controller';

describe('TodoController', () => {
  let app;
  let todoService: TodoService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    todoService = module.get<TodoService>(TodoService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('(GET) /todos should return all todos', async () => {
    const todos = [
      { id: 1, content: 'New Task', done: false, isDeleted: false },
    ];

    jest.spyOn(todoService, 'findAll').mockResolvedValue(todos);

    const response = await request(app.getHttpServer())
      .get('/todos')
      .expect(200);

    expect(response.body).toEqual(todos);
  });

  it('(POST) /todos should create a new todo', async () => {
    const createTodoRequest: CreateTodoRequest = { content: 'New Task' };
    const createdTodo = {
      id: 2,
      ...createTodoRequest,
      done: false,
      isDeleted: false,
    };

    jest.spyOn(todoService, 'create').mockResolvedValue(createdTodo);

    const response = await request(app.getHttpServer())
      .post('/todos')
      .send(createTodoRequest)
      .expect(201);

    expect(response.body).toEqual(createdTodo);
  });

  it('(PATCH) /todos/:id should update a todo', async () => {
    const todoId = 1;
    const updatedTodo = {
      id: todoId,
      content: 'Task 1',
      done: true,
      isDeleted: false,
    };

    jest.spyOn(todoService, 'update').mockResolvedValue(updatedTodo);

    const response = await request(app.getHttpServer())
      .patch(`/todos/${todoId}`)
      .expect(200);

    expect(response.body).toEqual(updatedTodo);
  });

  it('(DELETE) /todos/:id should delete a todo', async () => {
    const todoId = 1;

    jest.spyOn(todoService, 'remove').mockResolvedValue(undefined);

    await request(app.getHttpServer()).delete(`/todos/${todoId}`).expect(200);
  });
});
