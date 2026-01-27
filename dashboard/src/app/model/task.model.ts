export interface Task {
  id: number;
  title: string;
  status: 'TODO' | 'DONE';
  category: 'Work' | 'Personal';
}
