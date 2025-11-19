import type { Timestamp } from 'firebase/firestore';

export interface Task {
  id: string;
  description: string;
  dueDate: Date | null;
  completed: boolean;
  createdAt: Date;
}

export interface TaskDocument {
  description: string;
  dueDate: Timestamp | null;
  completed: boolean;
  createdAt: Timestamp;
}
