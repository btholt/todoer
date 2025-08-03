"use client";

import { useState } from "react";
import { TodoItem } from "./todo-item";
import { TodoForm } from "./todo-form";
import { TodoWithLabel, Label } from "@/lib/db";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TodoListProps {
  initialTodos: TodoWithLabel[];
  labels: Label[];
}

export function TodoList({ initialTodos, labels }: TodoListProps) {
  const [todos, setTodos] = useState<TodoWithLabel[]>(initialTodos);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [labelFilter, setLabelFilter] = useState<string>("all");

  const createTodo = async (data: {
    title: string;
    description?: string;
    labelId?: string;
    dueDate?: string;
  }) => {
    const response = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        labelId: data.labelId ? parseInt(data.labelId) : null,
        dueDate: data.dueDate || null,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create todo");
    }

    const newTodo = await response.json();
    
    // Find label details for the new todo
    const label = labels.find(l => l.id === newTodo.label_id);
    const todoWithLabel: TodoWithLabel = {
      ...newTodo,
      label_name: label?.name,
      label_color: label?.color,
    };
    
    setTodos(prev => [todoWithLabel, ...prev]);
  };

  const toggleComplete = async (id: number, completed: boolean) => {
    const response = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });

    if (!response.ok) {
      throw new Error("Failed to update todo");
    }

    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed } : todo
      )
    );
  };

  const deleteTodo = async (id: number) => {
    const response = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete todo");
    }

    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    const statusMatch = 
      filter === "all" ? true :
      filter === "active" ? !todo.completed :
      filter === "completed" ? todo.completed : true;

    const labelMatch = 
      labelFilter === "all" ? true :
      labelFilter === "none" ? !todo.label_id :
      todo.label_id?.toString() === labelFilter;

    return statusMatch && labelMatch;
  });

  const activeTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <TodoForm labels={labels} onSubmit={createTodo} />
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <Badge variant="outline">{activeTodos} active</Badge>
        <Badge variant="outline">{completedTodos} completed</Badge>
        <Badge variant="outline">{todos.length} total</Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("active")}
          >
            Active
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
          >
            Completed
          </Button>
        </div>

        <Select value={labelFilter} onValueChange={setLabelFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by label" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All labels</SelectItem>
            <SelectItem value="none">No label</SelectItem>
            {labels.map((label) => (
              <SelectItem key={label.id} value={label.id.toString()}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: label.color }}
                  />
                  {label.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {filter === "all" 
              ? "No todos yet. Create your first todo above!"
              : `No ${filter} todos found.`
            }
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={toggleComplete}
              onDelete={deleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
}