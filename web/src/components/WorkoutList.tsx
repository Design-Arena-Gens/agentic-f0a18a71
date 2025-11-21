import type { Workout } from '../types';
import { format } from 'date-fns';

interface WorkoutListProps {
  workouts: Workout[];
  onDelete(id: string): void;
}

function totalVolume(workout: Workout): number {
  return workout.exercises.reduce((sum, ex) => sum + ex.sets * ex.reps * ex.weight, 0);
}

export default function WorkoutList({ workouts, onDelete }: WorkoutListProps) {
  if (workouts.length === 0) {
    return <div className="card"><p>No workouts yet. Add your first one!</p></div>;
  }

  const sorted = [...workouts].sort((a, b) => a.date.localeCompare(b.date)).reverse();

  return (
    <div className="card">
      <h2>Workouts</h2>
      <ul className="workout-list">
        {sorted.map(w => (
          <li key={w.id} className="workout-item">
            <div className="meta">
              <strong>{format(new Date(w.date), 'EEE, MMM d, yyyy')}</strong>
              <span className="volume">Total Volume: {totalVolume(w).toLocaleString()} kg</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Exercise</th>
                  <th>Sets</th>
                  <th>Reps</th>
                  <th>Weight (kg)</th>
                </tr>
              </thead>
              <tbody>
                {w.exercises.map((ex, i) => (
                  <tr key={i}>
                    <td>{ex.name}</td>
                    <td>{ex.sets}</td>
                    <td>{ex.reps}</td>
                    <td>{ex.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {w.notes && <p className="notes">{w.notes}</p>}
            <div className="actions">
              <button className="danger" onClick={() => onDelete(w.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
