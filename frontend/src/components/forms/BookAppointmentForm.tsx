
import { useState, useEffect } from 'react';
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

interface BookAppointmentFormProps {
  onAppointmentBooked: () => void;
}

export const BookAppointmentForm = ({ onAppointmentBooked }: BookAppointmentFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState([]);
  const [formData, setFormData] = useState({
    provider_id: '',
    appointment_date: '',
    appointment_time: '',
    type: '',
    reason: ''
  });

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    const { data, error } = await supabase
      .from('healthcare_providers')
      .select('*')
      .eq('is_available', true)
      .order('first_name');

    if (!error) {
      setProviders(data || []);
    }
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
        .from('appointments')
        .insert({
          patient_id: user.id,
          provider_id: formData.provider_id,
          appointment_date: formData.appointment_date,
          appointment_time: formData.appointment_time,
          type: formData.type,
          reason: formData.reason || null,
          status: 'scheduled'
        });

      if (error) throw error;

      toast({
        title: "Appointment Scheduled",
        description: "Your appointment has been successfully scheduled.",
      });

      setFormData({
        provider_id: '',
        appointment_date: '',
        appointment_time: '',
        type: '',
        reason: ''
      });
      setOpen(false);
      onAppointmentBooked();
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Error",
        description: "Failed to schedule appointment. Please try again.",
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
          Schedule New
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="provider_id">Healthcare Provider</Label>
            <Select value={formData.provider_id} onValueChange={(value) => setFormData({...formData, provider_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((provider: any) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    Dr. {provider.first_name} {provider.last_name} - {provider.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="appointment_date">Date</Label>
            <Input
              id="appointment_date"
              type="date"
              value={formData.appointment_date}
              onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div>
            <Label htmlFor="appointment_time">Time</Label>
            <Input
              id="appointment_time"
              type="time"
              value={formData.appointment_time}
              onChange={(e) => setFormData({...formData, appointment_time: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Appointment Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in_person">In Person</SelectItem>
                <SelectItem value="video_call">Video Call</SelectItem>
                <SelectItem value="phone_call">Phone Call</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="reason">Reason for Visit</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              placeholder="Describe your symptoms or reason for the visit"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Booking...' : 'Book Appointment'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
