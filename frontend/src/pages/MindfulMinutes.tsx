import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Exercise = {
  id: number;
  name: string;
  duration: number;
  description: string;
};

const exercises: Exercise[] = [
  {
    id: 1,
    name: 'Deep Breathing',
    duration: 120,
    description: 'Inhale for 4 seconds, hold for 4, exhale for 6'
  },
  {
    id: 2,
    name: 'Body Scan',
    duration: 180,
    description: 'Focus attention slowly from head to toes'
  },
  {
    id: 3,
    name: 'Gratitude',
    duration: 90,
    description: 'Reflect on three things you\'re grateful for'
  }
];

export default function MindfulMinutes() {
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startExercise = (exercise: Exercise) => {
    setActiveExercise(exercise);
    setTimeLeft(exercise.duration);
    setIsActive(true);
  };

  const togglePause = () => {
    setIsActive(!isActive);
  };

  const resetExercise = () => {
    setIsActive(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Mindful Minutes</CardTitle>
        </CardHeader>
        <CardContent>
          {!activeExercise ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Choose an exercise:</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {exercises.map((exercise) => (
                  <Card key={exercise.id} className="cursor-pointer hover:bg-gray-50" onClick={() => startExercise(exercise)}>
                    <CardContent className="p-4">
                      <h4 className="font-medium">{exercise.name}</h4>
                      <p className="text-sm text-gray-600">{exercise.description}</p>
                      <p className="text-xs text-gray-500 mt-2">{formatTime(exercise.duration)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-semibold">{activeExercise.name}</h3>
              <p className="text-lg">{activeExercise.description}</p>
              <div className="text-5xl font-bold my-8">{formatTime(timeLeft)}</div>
              <div className="flex justify-center space-x-4">
                <Button onClick={togglePause}>
                  {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                  {isActive ? 'Pause' : 'Resume'}
                </Button>
                <Button variant="outline" onClick={resetExercise}>
                  <RotateCcw className="mr-2" />
                  Reset
                </Button>
                <Button variant="outline" onClick={() => setActiveExercise(null)}>
                  <ArrowLeft className="mr-2" />
                  Back
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
