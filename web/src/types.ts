export interface ExerciseEntry {
  name: string;
  sets: number;
  reps: number;
  weight: number; // in kg
}

export interface Workout {
  id: string;
  date: string; // ISO date (yyyy-MM-dd)
  exercises: ExerciseEntry[];
  notes?: string;
}
