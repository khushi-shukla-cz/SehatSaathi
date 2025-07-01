import { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/types/supabase';
import { supabase } from '@/lib/supabaseClient';

export default function SymptomJournal() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Database['public']['Tables']['symptom_entries']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [newEntry, setNewEntry] = useState<{
    symptom: string;
    severity: number;
    date: string;
    notes: string;
  }>({
    symptom: '',
    severity: 3,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    // Test Supabase connection
    supabase
      .from('symptom_entries')
      .select('*')
      .limit(1)
      .then(({ data, error }) => {
        if (error) {
          console.error('Supabase connection error:', error);
        } else {
          console.log('Supabase connected successfully');
        }
      });

    if (user) {
      console.log('Current user:', user.id);
      fetchEntries();
    } else {
      console.warn('No authenticated user');
    }
  }, [user]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('symptom_entries')
        .select('*')
        .eq('user_id', user?.id || '')
        .order('date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting to submit:', newEntry);
    
    if (!user) {
      console.error('Submission failed: No user authenticated');
      return;
    }

    try {
      const submission = {
        user_id: user.id,
        symptom: newEntry.symptom,
        severity: Number(newEntry.severity),
        date: newEntry.date,
        notes: newEntry.notes || null
      };
      
      console.log('Full submission payload:', submission);
      
      const { data, error } = await supabase
        .from('symptom_entries')
        .insert([submission])
        .select();

      if (error) {
        console.error('Database error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return;
      }

      console.log('Insert result:', data);
      setEntries([data[0], ...entries]);
      
      // Reset form
      setNewEntry({
        symptom: '',
        severity: 3,
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      await supabase.from('symptom_entries').delete().eq('id', id);
      setEntries(entries.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Symptom Journal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="symptom">Symptom</Label>
                <Input
                  id="symptom"
                  value={newEntry.symptom}
                  onChange={(e) => setNewEntry({...newEntry, symptom: e.target.value})}
                  placeholder="Headache, nausea, etc."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="severity">Severity (1-5)</Label>
                <Select
                  value={newEntry.severity.toString()}
                  onValueChange={(value) => setNewEntry({...newEntry, severity: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} - {num === 1 ? 'Mild' : num === 5 ? 'Severe' : 'Moderate'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <DatePicker
                  date={new Date(newEntry.date)}
                  setDate={(date) => setNewEntry({...newEntry, date: date.toISOString().split('T')[0]})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                  placeholder="Additional details"
                />
              </div>
            </div>
            
            <Button type="submit" className="gap-2">
              <Plus size={16} />
              Add Entry
            </Button>
          </form>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Your Symptom History</h3>
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : entries.length === 0 ? (
              <p className="text-gray-500">No entries yet. Add your first symptom above.</p>
            ) : (
              <div className="space-y-2">
                {entries.map((entry) => (
                  <div key={entry.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{entry.symptom}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(entry.date).toLocaleDateString()} • 
                        Severity: {entry.severity}/5 • 
                        {entry.notes}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => entry.id && deleteEntry(entry.id)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
