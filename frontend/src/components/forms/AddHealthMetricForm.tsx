
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AddHealthMetricFormProps {
  onMetricAdded: () => void;
}

export const AddHealthMetricForm = ({ onMetricAdded }: AddHealthMetricFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    metric_type: '',
    value: '',
    unit: '',
    notes: ''
  });

  const metricTypes = [
    { value: 'blood_pressure', label: 'Blood Pressure', unit: 'mmHg' },
    { value: 'heart_rate', label: 'Heart Rate', unit: 'bpm' },
    { value: 'weight', label: 'Weight', unit: 'lbs' },
    { value: 'height', label: 'Height', unit: 'inches' },
    { value: 'blood_sugar', label: 'Blood Sugar', unit: 'mg/dL' },
    { value: 'temperature', label: 'Temperature', unit: '°F' },
    { value: 'oxygen_saturation', label: 'Oxygen Saturation', unit: '%' },
    { value: 'bmi', label: 'BMI', unit: 'kg/m²' }
  ];

  const handleTypeChange = (type: string) => {
    const selectedType = metricTypes.find(t => t.value === type);
    setFormData({
      ...formData,
      metric_type: type,
      unit: selectedType?.unit || ''
    });
  };

  const ensureProfileExists = async () => {
    if (!user) return false;
    
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            first_name: user.user_metadata?.first_name || 'User',
            last_name: user.user_metadata?.last_name || ''
          });

        if (error) {
          console.error('Error creating profile:', error);
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Error ensuring profile exists:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const profileExists = await ensureProfileExists();
      if (!profileExists) {
        throw new Error('Failed to create user profile');
      }

      const { error } = await supabase
        .from('health_metrics')
        .insert({
          patient_id: user.id,
          metric_type: formData.metric_type,
          value: parseFloat(formData.value),
          unit: formData.unit,
          notes: formData.notes || null,
          recorded_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Health Metric Added",
        description: "Your health metric has been successfully recorded.",
      });

      setFormData({
        metric_type: '',
        value: '',
        unit: '',
        notes: ''
      });
      setOpen(false);
      onMetricAdded();
    } catch (error) {
      console.error('Error adding health metric:', error);
      toast({
        title: "Error",
        description: "Failed to add health metric. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Reading
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Health Metric</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="metric_type">Metric Type</Label>
            <Select value={formData.metric_type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select metric type" />
              </SelectTrigger>
              <SelectContent>
                {metricTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="value">Value</Label>
            <div className="flex gap-2">
              <Input
                id="value"
                type="number"
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
                required
                className="flex-1"
              />
              <Input
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                placeholder="Unit"
                className="w-20"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Any additional notes"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Adding...' : 'Add Metric'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
