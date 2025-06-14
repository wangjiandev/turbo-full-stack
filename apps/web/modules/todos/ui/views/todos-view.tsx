"use client";

import CreateTodo from "@/modules/todos/ui/components/create-todo";
import { trpc } from "@/trpc/client";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XSquareIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const TodosView = () => {
  const utils = trpc.useUtils();
  const { data: todos } = trpc.todo.getAllTodos.useQuery();

  const updateMutation = trpc.todo.updateTodo.useMutation({
    onSuccess: () => {
      utils.todo.getAllTodos.invalidate();
    },
  });
  const deleteMutation = trpc.todo.deleteTodo.useMutation({
    onSuccess: () => {
      utils.todo.getAllTodos.invalidate();
    },
  });

  const handleToggle = (id: string, completed: boolean) => {
    updateMutation.mutate({
      id,
      data: {
        completed: !completed,
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate({
      id,
    });
  };

  return (
    <div className="container mx-auto space-y-4">
      <CreateTodo />
      <div className="flex flex-col gap-1 max-w-lg mx-auto">
        {todos?.map((todo) => (
          <Card key={todo.id} className="shadow-none ">
            <CardHeader>
              <CardTitle className={cn(todo.completed ? "line-through" : "")}>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() =>
                      handleToggle(todo.id, todo.completed)
                    }
                  />
                  <span>{todo.name}</span>
                </div>
              </CardTitle>
              <CardDescription>{todo.description}</CardDescription>
              <CardDescription>{todo.dueDate}</CardDescription>
              <CardAction>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleToggle(todo.id, todo.completed)}
                >
                  <XSquareIcon className="size-4" />
                </Button>
              </CardAction>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TodosView;
