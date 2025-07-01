import type { Habit } from '@/types/supabase';
import { useState, useEffect } from 'react';
import { Plus, Check, X, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function HabitsTracker() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [newHabit, setNewHabit] = useState({
    name: '',
    frequency: 'daily' as const,
    target_count: 1,
    start_date: new Date().toISOString().split('T')[0],
    end_date: ''
  });

  useEffect(() => {
    if (user) fetchHabits();
  }, [user]);

  const fetchHabits = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user?.id || '')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHabits(data || []);
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([{
          user_id: user.id,
          name: newHabit.name,
          frequency: newHabit.frequency,
          target_count: newHabit.target_count,
          start_date: newHabit.start_date,
          end_date: newHabit.end_date || null
        }])
        .select();

      if (error) throw error;
      
      setHabits([data[0], ...habits]);
      setNewHabit({
        name: '',
        frequency: 'daily',
        target_count: 1,
        start_date: new Date().toISOString().split('T')[0],
        end_date: ''
      });
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const incrementHabit = async (habitId: string) => {
    try {
      const habit = habits.find(h => h.id === habitId);
      if (!habit) return;

      const newCount = Math.min(habit.current_count + 1, habit.target_count);
      const { error } = await supabase
        .from('habits')
        .update({ current_count: newCount })
        .eq('id', habitId);

      if (error) throw error;
      
      setHabits(habits.map(h => 
        h.id === habitId ? { ...h, current_count: newCount } : h
      ));
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Habit</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Habit Name</Label>
                <Input
                  id="name"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={newHabit.frequency}
                  onValueChange={(value) => setNewHabit({...newHabit, frequency: value as 'daily' | 'weekly'})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="target">Target Count</Label>
                <Input
                  id="target"
                  type="number"
                  min="1"
                  value={newHabit.target_count}
                  onChange={(e) => setNewHabit({...newHabit, target_count: parseInt(e.target.value) || 1})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <DatePicker
                  date={new Date(newHabit.start_date)}
                  onSelect={(date) => setNewHabit({...newHabit, start_date: date.toISOString().split('T')[0]})}
                />
              </div>
            </div>
            <Button type="submit" className="gap-2">
              <Plus size={16} /> Add Habit
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Habits</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading habits...</div>
          ) : habits.length === 0 ? (
            <div>No habits tracked yet</div>
          ) : (
            <div className="space-y-4">
              {habits.map((habit) => (
                <div key={habit.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{habit.name}</h3>
                    <span className="text-sm text-gray-500">
                      {habit.frequency === 'daily' ? 'Daily' : 'Weekly'} - Target: {habit.target_count}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-green-500 h-4 rounded-full"
                        style={{
                          width: `${Math.min(100, (habit.current_count / habit.target_count) * 100)}%`
                        }}
                      />
                    </div>
                    <span className="text-sm">
                      {habit.current_count}/{habit.target_count}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => incrementHabit(habit.id)}
                      disabled={habit.current_count >= habit.target_count}
                    >
                      <Check size={16} className="mr-2" /> Log
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
