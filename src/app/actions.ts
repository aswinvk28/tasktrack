"use server";

import { revalidatePath } from "next/cache";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  query,
  where,
  orderBy,
  WriteBatch,
  writeBatch,
} from "firebase/firestore";
import { z } from "zod";
import { db } from "@/lib/firebase";
import type { Task, TaskDocument } from "@/lib/types";

const TaskSchema = z.object({
  description: z.string().min(1, "Description cannot be empty."),
  dueDate: z.date().nullable(),
});

type GetTasksParams = {
  sortBy: string;
  filter: string;
};

export async function getTasks({ sortBy, filter }: GetTasksParams): Promise<Task[]> {
  try {
    const tasksCol = collection(db, "tasks");

    const [sortField, sortDirection] = sortBy.split("_");
    
    let q;
    const orderClause = orderBy(sortField, sortDirection as "asc" | "desc");

    if (filter === "completed") {
      q = query(tasksCol, where("completed", "==", true), orderClause);
    } else if (filter === "active") {
      q = query(tasksCol, where("completed", "==", false), orderClause);
    } else {
      q = query(tasksCol, orderClause);
    }

    const querySnapshot = await getDocs(q);
    const tasks: Task[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as TaskDocument;
      return {
        id: doc.id,
        description: data.description,
        dueDate: data.dueDate ? data.dueDate.toDate() : null,
        completed: data.completed,
        createdAt: data.createdAt.toDate(),
      };
    });
    return tasks;
  } catch (error) {
    console.error("Error getting tasks:", error);
    return [];
  }
}

export async function addTask(formData: FormData) {
  const values = {
    description: formData.get("description"),
    dueDate: formData.get("dueDate") ? new Date(formData.get("dueDate") as string) : null,
  };

  const validatedFields = TaskSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { description, dueDate } = validatedFields.data;
    await addDoc(collection(db, "tasks"), {
      description,
      dueDate: dueDate ? Timestamp.fromDate(dueDate) : null,
      completed: false,
      createdAt: Timestamp.now(),
    });

    revalidatePath("/");
    return { message: "Task added successfully." };
  } catch (error) {
    return { error: "Failed to add task." };
  }
}

export async function updateTask(id: string, formData: FormData) {
  const values = {
    description: formData.get("description"),
    dueDate: formData.get("dueDate") ? new Date(formData.get("dueDate") as string) : null,
  };

  const validatedFields = TaskSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { description, dueDate } = validatedFields.data;
    const taskRef = doc(db, "tasks", id);
    await updateDoc(taskRef, {
      description,
      dueDate: dueDate ? Timestamp.fromDate(dueDate) : null,
    });
    
    revalidatePath("/");
    return { message: "Task updated successfully." };
  } catch (error) {
    return { error: "Failed to update task." };
  }
}

export async function toggleTaskCompletion(id: string, completed: boolean) {
  try {
    const taskRef = doc(db, "tasks", id);
    await updateDoc(taskRef, { completed: !completed });
    
    revalidatePath("/");
  } catch (error) {
    return { error: "Failed to update task status." };
  }
}

export async function deleteTask(id: string) {
  try {
    await deleteDoc(doc(db, "tasks", id));
    revalidatePath("/");
    return { message: "Task deleted successfully." };
  } catch (error) {
    return { error: "Failed to delete task." };
  }
}
