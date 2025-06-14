"use client";

import { trpc } from "@/trpc/client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const CreateTodo = () => {
  const utils = trpc.useUtils();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");

  const mutation = trpc.todo.createTodo.useMutation({
    onSuccess: () => {
      setName("");
      setDescription("");
      setDueDate("");
      setPriority("low");
      utils.todo.getAllTodos.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(name, description, dueDate, priority);

    if (!name || !description) {
      return;
    }

    mutation.mutate({
      name,
      description,
      completed: false,
      dueDate,
      priority,
    });
  };

  return (
    <Card className="w-full max-w-lg mx-auto mt-10 shadow-none">
      <CardHeader>
        <CardTitle>Create Todo</CardTitle>
        <CardDescription>Create a new todo</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="Due Date"
          />
          <Select
            value={priority}
            onValueChange={(value) =>
              setPriority(value as "low" | "medium" | "high")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="w-full relative duration-200"
            disabled={mutation.isPending}
            type="submit"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="size-6 animate-spin absolute left-4 top-1/2 -translate-y-1/2" />
                <span>Creating...</span>
              </>
            ) : (
              <span>Create</span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateTodo;
