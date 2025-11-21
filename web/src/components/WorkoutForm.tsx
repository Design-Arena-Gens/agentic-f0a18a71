import { useState } from 'react';
import { format } from 'date-fns';
import type { ExerciseEntry, Workout } from '../types';

interface WorkoutFormProps {
  onAdd(workout: Workout): void;
}

function createEmptyExercise(): ExerciseEntry {
  return {
    name: '',
    sets: 3,
    reps: 10,
    weight: 0,
  };
}

export default function WorkoutForm({ onAdd }: WorkoutFormProps) {
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [exercises, setExercises] = useState<ExerciseEntry[]>([createEmptyExercise()]);
  const [notes, setNotes] = useState<string>('');

  function updateExercise(index: number, patch: Partial<ExerciseEntry>) {
    setExercises(prev => prev.map((e, i) => (i === index ? { ...e, ...patch } : e)));
  }

  function addExercise() {
    setExercises(prev => [...prev, createEmptyExercise()]);
  }

  function removeExercise(index: number) {
    setExercises(prev => prev.filter((_, i) => i !== index));
  }

  function validate(): string | null {
    if (!date) return 'Please select a date.';
    if (exercises.length === 0) return 'Add at least one exercise.';
    for (const ex of exercises) {
      if (!ex.name.trim()) return 'Exercise name cannot be empty.';
      if (ex.sets <= 0 || ex.reps <= 0) return 'Sets and reps must be positive.';
      if (ex.weight < 0) return 'Weight cannot be negative.';
    }
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const error = validate();
    if (error) {
      alert(error);
      return;
    }
    const workout: Workout = {
      id: crypto.randomUUID(),
      date,
      exercises: exercises.map(ex => ({
        name: ex.name.trim(),
        sets: Number(ex.sets),
        reps: Number(ex.reps),
        weight: Number(ex.weight),
      })),
      notes: notes.trim() || undefined,
    };
    onAdd(workout);
    // reset
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setExercises([createEmptyExercise()]);
    setNotes('');
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>Add Workout</h2>
      <div className="row">
        <label htmlFor="date">Date</label>
        <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
      </div>

      <div className="exercises">
        <h3>Exercises</h3>
        {exercises.map((ex, index) => (
          <div className="exercise" key={index}>
            <input
              placeholder="Name (e.g., Bench Press)"
              value={ex.name}
              onChange={e => updateExercise(index, { name: e.target.value })}
            />
            <input
              type="number"
              min={1}
              placeholder="Sets"
              value={ex.sets}
              onChange={e => updateExercise(index, { sets: Number(e.target.value) })}
            />
            <input
              type="number"
              min={1}
              placeholder="Reps"
              value={ex.reps}
              onChange={e => updateExercise(index, { reps: Number(e.target.value) })}
            />
            <input
              type="number"
              min={0}
              step={0.5}
              placeholder="Weight (kg)"
              value={ex.weight}
              onChange={e => updateExercise(index, { weight: Number(e.target.value) })}
            />
            <button type="button" className="danger" onClick={() => removeExercise(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addExercise}>
          + Add Exercise
        </button>
      </div>

      <div className="row">
        <label htmlFor="notes">Notes</label>
        <textarea id="notes" placeholder="Optional notes" value={notes} onChange={e => setNotes(e.target.value)} />
      </div>

      <div className="actions">
        <button type="submit">Save Workout</button>
      </div>
    </form>
  );
}
