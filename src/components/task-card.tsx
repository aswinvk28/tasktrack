"use client";

import { useState, useTransition } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { TaskDialog } from "@/components/task-dialog";
import { deleteTask, toggleTaskCompletion } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function TaskCard({ task }: { task: Task }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleToggleCompletion = () => {
    startTransition(async () => {
      const result = await toggleTaskCompletion(task.id, task.completed);
      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  };

  const handleDelete = async () => {
    const result = await deleteTask(task.id);
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Task deleted successfully.",
      });
    }
  };

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  return (
    <Card
      className={cn(
        "flex flex-col transition-all",
        task.completed && "bg-muted/50",
        isPending && "opacity-50"
      )}
    >
      <CardHeader className="flex-row items-start gap-4 space-y-0">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={handleToggleCompletion}
          aria-label="Mark task as complete"
          className="mt-1"
        />
        <div className="flex-1">
          <CardTitle
            className={cn(
              "text-lg transition-all",
              task.completed && "text-muted-foreground line-through"
            )}
          >
            {task.description}
          </CardTitle>
          <CardDescription>
            Created {formatDistanceToNow(task.createdAt, { addSuffix: true })}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {task.dueDate && (
          <div className={cn(
            "flex items-center text-sm",
            task.completed ? "text-muted-foreground" : "text-foreground",
            isOverdue && "text-destructive font-medium"
          )}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Due on {format(task.dueDate, "PPP")}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <TaskDialog
          task={task}
          trigger={
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit Task</span>
            </Button>
          }
        />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4 text-destructive" />
              <span className="sr-only">Delete Task</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                task.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className={cn(buttonVariants({variant: "destructive"}))}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
