import { nanoid } from 'nanoid';
import { Injectable } from '@nestjs/common';
import { CreateTodo, Todo } from './todo.schema';

@Injectable()
export class TodosService {
  private todos: Todo[] = [];

  getTodoById(id: string) {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    return todo;
  }

  getAllTodos() {
    return this.todos;
  }

  async createTodo(todoData: CreateTodo) {
    const newTodo = {
      ...todoData,
      id: nanoid(),
      createdAt: new Date().toISOString(),
    };
    this.todos.push(newTodo);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return newTodo;
  }

  updateTodo(id: string, data: Partial<CreateTodo>) {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index === -1) {
      throw new Error('Todo not found');
    }
    this.todos[index] = { ...this.todos[index], ...data };
    return this.todos[index];
  }

  deleteTodo(id: string) {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index === -1) {
      throw new Error('Todo not found');
    }
    this.todos.splice(index, 1);
    return true;
  }
}
