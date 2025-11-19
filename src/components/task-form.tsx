"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { addTask, updateTask } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X } from "lucide-react";

interface TaskFormProps {
  task?: Task;
  setOpen: (open: boolean) => void;
}

const formSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required.",
  }),
  dueDate: z.date().nullable().optional(),
});

type TaskFormValues = z.infer<typeof formSchema>;

export function TaskForm({ task, setOpen }: TaskFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: task?.description ?? "",
      dueDate: task?.dueDate ?? null,
    },
  });

  const onSubmit = (values: TaskFormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("description", values.description);
      if (values.dueDate) {
        formData.append("dueDate", values.dueDate.toISOString());
      }
      
      const result = task 
        ? await updateTask(task.id, formData)
        : await addTask(formData);

      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: task ? "Task updated successfully." : "Task added successfully.",
        });
        setOpen(false);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Finish project report" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
                <div className="relative">
                  <DatePicker date={field.value ?? undefined} setDate={field.onChange} />
                  {field.value && (
                     <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => field.onChange(null)}
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </Button>
                  )}
                </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {task ? "Save Changes" : "Add Task"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
