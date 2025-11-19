"use client";

import { useState } from "react";
import type { Task } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskForm } from "@/components/task-form";

interface TaskDialogProps {
  task?: Task;
  trigger: React.ReactNode;
}

export function TaskDialog({ task, trigger }: TaskDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Add a new task"}</DialogTitle>
          <DialogDescription>
            {task
              ? "Update the details of your task here."
              : "Fill in the details below to add a new task to your list."}
          </DialogDescription>
        </DialogHeader>
        <TaskForm task={task} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
