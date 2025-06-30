
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AddMedicationFormProps {
  onMedicationAdded: () => void;
}

export const AddMedicationForm = ({ onMedicationAdded }: AddMedicationFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    instructions: '',
    pills_total: '',
    start_date: new Date().toISOString().split('T')[0]
  });

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
        .from('medications')
        .insert({
          patient_id: user.id,
          name: formData.name,
          dosage: formData.dosage,
          frequency: formData.frequency,
          instructions: formData.instructions,
          pills_total: parseInt(formData.pills_total) || null,
          pills_remaining: parseInt(formData.pills_total) || null,
          start_date: formData.start_date,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Medication Added",
        description: "Your medication has been successfully added.",
      });

      setFormData({
        name: '',
        dosage: '',
        frequency: '',
        instructions: '',
        pills_total: '',
        start_date: new Date().toISOString().split('T')[0]
      });
      setOpen(false);
      onMedicationAdded();
    } catch (error) {
      console.error('Error adding medication:', error);
      toast({
        title: "Error",
        description: "Failed to add medication. Please try again.",
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
          Add Medication
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Medication</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Medication Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              placeholder="e.g., 10mg"
              value={formData.dosage}
              onChange={(e) => setFormData({...formData, dosage: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={formData.frequency} onValueChange={(value) => setFormData({...formData, frequency: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Once daily">Once daily</SelectItem>
                <SelectItem value="Twice daily">Twice daily</SelectItem>
                <SelectItem value="Three times daily">Three times daily</SelectItem>
                <SelectItem value="Four times daily">Four times daily</SelectItem>
                <SelectItem value="As needed">As needed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="pills_total">Total Pills (optional)</Label>
            <Input
              id="pills_total"
              type="number"
              value={formData.pills_total}
              onChange={(e) => setFormData({...formData, pills_total: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({...formData, start_date: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              placeholder="e.g., Take with food"
              value={formData.instructions}
              onChange={(e) => setFormData({...formData, instructions: e.target.value})}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Adding...' : 'Add Medication'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
