
import { useState } from "react";
import { Calendar, Clock, User, MapPin, Phone, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (appointment: any) => void;
  appointment?: any;
  mode: "create" | "reschedule";
}

const AppointmentModal = ({ isOpen, onClose, onSubmit, appointment, mode }: AppointmentModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    appointment ? new Date(appointment.date) : undefined
  );
  const [formData, setFormData] = useState({
    doctor: appointment?.doctor || "",
    specialty: appointment?.specialty || "",
    time: appointment?.time || "",
    type: appointment?.type || "",
    location: appointment?.location || "",
    phone: appointment?.phone || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    const appointmentData = {
      ...formData,
      date: format(selectedDate, "MMM dd, yyyy"),
      status: "pending",
      id: appointment?.id || Date.now(),
    };

    onSubmit(appointmentData);
    onClose();
    setFormData({
      doctor: "",
      specialty: "",
      time: "",
      type: "",
      location: "",
      phone: "",
    });
    setSelectedDate(undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {mode === "create" ? "Schedule New Appointment" : "Reschedule Appointment"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Doctor</label>
              <Select value={formData.doctor} onValueChange={(value) => setFormData({...formData, doctor: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr. Sarah Johnson">Dr. Sarah Johnson</SelectItem>
                  <SelectItem value="Dr. Michael Chen">Dr. Michael Chen</SelectItem>
                  <SelectItem value="Dr. Emily Rodriguez">Dr. Emily Rodriguez</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Specialty</label>
              <Select value={formData.specialty} onValueChange={(value) => setFormData({...formData, specialty: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Primary Care">Primary Care</SelectItem>
                  <SelectItem value="Dermatology">Dermatology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <Select value={formData.time} onValueChange={(value) => setFormData({...formData, time: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                  <SelectItem value="10:30 AM">10:30 AM</SelectItem>
                  <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                  <SelectItem value="3:15 PM">3:15 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Appointment Type</label>
              <Input
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                placeholder="e.g., Follow-up, Consultation"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="e.g., Heart Center - Room 205"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="e.g., (555) 123-4567"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              {mode === "create" ? "Schedule Appointment" : "Reschedule"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
