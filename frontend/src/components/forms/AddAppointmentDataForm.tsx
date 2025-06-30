
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AddAppointmentDataFormProps {
  appointmentId: string;
  onDataAdded: () => void;
}

export const AddAppointmentDataForm = ({ appointmentId, onDataAdded }: AddAppointmentDataFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    record_type: '',
    record_date: new Date().toISOString().split('T')[0]
  });

  const recordTypes = [
    { value: 'visit_notes', label: 'Visit Notes' },
    { value: 'lab_results', label: 'Lab Results' },
    { value: 'imaging', label: 'Imaging' },
    { value: 'prescription', label: 'Prescription' },
    { value: 'vaccination', label: 'Vaccination' },
    { value: 'diagnosis', label: 'Diagnosis' }
  ];

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
        .from('medical_records')
        .insert({
          patient_id: user.id,
          title: formData.title,
          content: formData.content,
          record_type: formData.record_type,
          record_date: formData.record_date
        });

      if (error) throw error;

      toast({
        title: "Medical Record Added",
        description: "The medical record has been successfully added.",
      });

      setFormData({
        title: '',
        content: '',
        record_type: '',
        record_date: new Date().toISOString().split('T')[0]
      });
      setOpen(false);
      onDataAdded();
    } catch (error) {
      console.error('Error adding medical record:', error);
      toast({
        title: "Error",
        description: "Failed to add medical record. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="w-4 h-4 mr-2" />
          Add Record
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Medical Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="record_type">Record Type</Label>
            <Select value={formData.record_type} onValueChange={(value) => setFormData({...formData, record_type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select record type" />
              </SelectTrigger>
              <SelectContent>
                {recordTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="record_date">Date</Label>
            <Input
              id="record_date"
              type="date"
              value={formData.record_date}
              onChange={(e) => setFormData({...formData, record_date: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Enter medical record details..."
              rows={4}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Adding...' : 'Add Record'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
