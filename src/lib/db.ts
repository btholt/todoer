import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  label_id: number | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  due_date: string | null;
}

export interface Label {
  id: number;
  name: string;
  color: string;
  created_at: string;
}

export interface TodoWithLabel extends Todo {
  label_name?: string;
  label_color?: string;
}

export async function getTodos(userId: string): Promise<TodoWithLabel[]> {
  const todos = await sql`
    SELECT 
      t.*,
      l.name as label_name,
      l.color as label_color
    FROM todos t
    LEFT JOIN labels l ON t.label_id = l.id
    WHERE t.user_id = ${userId}
    ORDER BY t.created_at DESC
  `;
  return todos as TodoWithLabel[];
}

export async function createTodo(
  userId: string,
  title: string,
  description?: string,
  labelId?: number,
  dueDate?: string
): Promise<Todo> {
  const [todo] = await sql`
    INSERT INTO todos (title, description, label_id, user_id, due_date)
    VALUES (${title}, ${description || null}, ${labelId || null}, ${userId}, ${dueDate || null})
    RETURNING *
  `;
  return todo as Todo;
}

export async function updateTodo(
  todoId: number,
  userId: string,
  updates: {
    title?: string;
    description?: string;
    completed?: boolean;
    label_id?: number;
    due_date?: string;
  }
): Promise<Todo | null> {
  // Use the neon sql template for simpler query building
  if (updates.completed !== undefined) {
    const [todo] = await sql`
      UPDATE todos 
      SET completed = ${updates.completed}, updated_at = NOW()
      WHERE id = ${todoId} AND user_id = ${userId}
      RETURNING *
    `;
    return todo as Todo;
  }

  if (updates.title !== undefined) {
    const [todo] = await sql`
      UPDATE todos 
      SET title = ${updates.title}, updated_at = NOW()
      WHERE id = ${todoId} AND user_id = ${userId}
      RETURNING *
    `;
    return todo as Todo;
  }

  return null;
}

export async function deleteTodo(todoId: number, userId: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM todos 
    WHERE id = ${todoId} AND user_id = ${userId}
  `;
  return result.length > 0;
}

export async function getLabels(): Promise<Label[]> {
  const labels = await sql`
    SELECT * FROM labels ORDER BY name
  `;
  return labels as Label[];
}