import { getTasks } from "@/app/actions";
import { TaskCard } from "@/components/task-card";
import { FilterControls } from "@/components/filter-controls";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { TaskDialog } from "@/components/task-dialog";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const sortBy =
    typeof searchParams.sort === "string" ? searchParams.sort : "createdAt_desc";
  const filter =
    typeof searchParams.filter === "string" ? searchParams.filter : "all";

  const tasks = await getTasks({ sortBy, filter });

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-6">
        <Logo />
        <TaskDialog
          trigger={
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          }
        />
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Your Tasks</h1>
          <FilterControls />
        </div>
        {tasks.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h2 className="text-2xl font-semibold">No Tasks Yet</h2>
            <p className="mb-4 mt-2 text-muted-foreground">
              Get started by adding your first task.
            </p>
            <TaskDialog
              trigger={
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              }
            />
          </div>
        )}
      </main>
    </div>
  );
}
