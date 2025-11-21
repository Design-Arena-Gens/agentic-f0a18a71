import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { Workout } from '../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface StatsProps {
  workouts: Workout[];
}

function groupByDate(workouts: Workout[]): { date: string; volume: number }[] {
  const totals = new Map<string, number>();
  for (const w of workouts) {
    const vol = w.exercises.reduce((sum, ex) => sum + ex.sets * ex.reps * ex.weight, 0);
    totals.set(w.date, (totals.get(w.date) || 0) + vol);
  }
  return Array.from(totals.entries())
    .map(([date, volume]) => ({ date, volume }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export default function Stats({ workouts }: StatsProps) {
  if (workouts.length === 0) {
    return <div className="card"><p>Add workouts to see your progress chart.</p></div>;
  }
  const dataPoints = groupByDate(workouts);
  const data = {
    labels: dataPoints.map(p => p.date),
    datasets: [
      {
        label: 'Total Volume (kg)',
        data: dataPoints.map(p => p.volume),
        borderColor: '#646cff',
        backgroundColor: 'rgba(100,108,255,0.2)',
        tension: 0.2,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      y: { beginAtZero: true },
    },
  } as const;

  return (
    <div className="card">
      <h2>Progress</h2>
      <Line data={data} options={options} />
    </div>
  );
}
