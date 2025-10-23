"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { TodoWithLabel } from "@/lib/db";

interface TodoItemProps {
  todo: TodoWithLabel;
  onToggleComplete: (id: number, completed: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function TodoItem({ todo, onToggleComplete, onDelete }: TodoItemProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleComplete = async () => {
    setIsLoading(true);
    try {
      await onToggleComplete(todo.id, !todo.completed);
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this todo?")) {
      setIsLoading(true);
      try {
        await onDelete(todo.id);
      } catch (error) {
        console.error("Failed to delete todo:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = todo.due_date && new Date(todo.due_date) < new Date() && !todo.completed;

  return (
    <Card className={`transition-opacity ${todo.completed ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={handleToggleComplete}
            disabled={isLoading}
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                {todo.title}
              </h3>
              {todo.label_name && (
                <Badge
                  variant="secondary"
                  className="text-xs dark:opacity-90"
                  style={{
                    backgroundColor: todo.label_color + '30',
                    color: todo.label_color,
                    borderColor: todo.label_color + '50',
                  }}
                >
                  {todo.label_name}
                </Badge>
              )}
              {isOverdue && (
                <Badge variant="destructive" className="text-xs">
                  Overdue
                </Badge>
              )}
            </div>
            
            {todo.description && (
              <p className={`text-sm text-muted-foreground ${todo.completed ? 'line-through' : ''}`}>
                {todo.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>Created: {formatDate(todo.created_at)}</span>
              {todo.due_date && (
                <span className={isOverdue ? 'text-destructive font-medium' : ''}>
                  Due: {formatDate(todo.due_date)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isLoading}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}