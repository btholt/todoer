import { stackServerApp } from "@/lib/stack";
import { redirect } from "next/navigation";
import { UserButton } from "@stackframe/stack";
import { getTodos, getLabels } from "@/lib/db";
import { TodoList } from "@/components/todos/todo-list";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function Dashboard() {
  const user = await stackServerApp.getUser();
  
  if (!user) {
    redirect("/handler/sign-in");
  }

  const [todos, labels] = await Promise.all([
    getTodos(user.id),
    getLabels(),
  ]);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Todoer</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.displayName || user.primaryEmail}!
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
      
      <TodoList initialTodos={todos} labels={labels} />
    </div>
  );
}