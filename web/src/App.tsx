import { useEffect, useMemo, useState } from 'react';
import type { Workout } from './types';
import WorkoutForm from './components/WorkoutForm';
import WorkoutList from './components/WorkoutList';
import Stats from './components/Stats';
import { loadWorkouts, saveWorkouts } from './storage';

function usePersistentWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    setWorkouts(loadWorkouts());
  }, []);

  useEffect(() => {
    saveWorkouts(workouts);
  }, [workouts]);

  return { workouts, setWorkouts } as const;
}

export default function App() {
  const { workouts, setWorkouts } = usePersistentWorkouts();
  const totalVolume = useMemo(
    () => workouts.reduce((sum, w) => sum + w.exercises.reduce((s, ex) => s + ex.sets * ex.reps * ex.weight, 0), 0),
    [workouts]
  );

  function handleAdd(workout: Workout) {
    setWorkouts(prev => [...prev, workout]);
  }

  function handleDelete(id: string) {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  }

  return (
    <div className="container">
      <header>
        <h1>FitTrack</h1>
        <p className="subtitle">Track workouts, visualize progress, stay consistent.</p>
        <div className="summary">
          <span>Workouts: {workouts.length}</span>
          <span>Total Volume: {totalVolume.toLocaleString()} kg</span>
        </div>
      </header>

      <main>
        <WorkoutForm onAdd={handleAdd} />
        <Stats workouts={workouts} />
        <WorkoutList workouts={workouts} onDelete={handleDelete} />
      </main>

      <footer>
        <small>Data is stored locally in your browser.</small>
      </footer>
    </div>
  );
}
