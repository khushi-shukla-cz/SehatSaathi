import { useState, useEffect } from "react";
import { Calendar, Clock, Plus, Search, Filter, MapPin, Phone, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookAppointmentForm } from "@/components/forms/BookAppointmentForm";
import { AddAppointmentDataForm } from "@/components/forms/AddAppointmentDataForm";
import RescheduleAppointmentModal from "@/components/RescheduleAppointmentModal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Appointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleModal, setRescheduleModal] = useState({
    isOpen: false,
    appointment: null
  });

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          healthcare_providers (
            first_name,
            last_name,
            specialty,
            phone,
            office_address
          )
        `)
        .eq('patient_id', user?.id)
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been successfully cancelled.",
      });

      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "scheduled":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "rescheduled":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleReschedule = (appointment: any) => {
    setRescheduleModal({
      isOpen: true,
      appointment
    });
  };

  const handleRescheduleComplete = () => {
    fetchAppointments();
    setRescheduleModal({
      isOpen: false,
      appointment: null
    });
  };

  // Filter appointments
  const now = new Date();
  const upcomingAppointments = appointments.filter((apt: any) => {
    const appointmentDateTime = new Date(`${apt.appointment_date}T${apt.appointment_time}`);
    return appointmentDateTime > now && apt.status !== 'cancelled';
  });

  const pastAppointments = appointments.filter((apt: any) => {
    const appointmentDateTime = new Date(`${apt.appointment_date}T${apt.appointment_time}`);
    return appointmentDateTime <= now || apt.status === 'completed' || apt.status === 'cancelled';
  });

  // Apply search and filter
  const filterAppointments = (appointmentList: any[]) => {
    return appointmentList.filter(appointment => {
      const matchesSearch = searchTerm === "" || 
        appointment.healthcare_providers?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.healthcare_providers?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.healthcare_providers?.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterSpecialty === "all" || 
        appointment.healthcare_providers?.specialty?.toLowerCase() === filterSpecialty.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  };

  const filteredUpcoming = filterAppointments(upcomingAppointments);
  const filteredPast = filterAppointments(pastAppointments);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage your healthcare appointments</p>
        </div>
        <BookAppointmentForm onAppointmentBooked={fetchAppointments} />
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={selectedTab === "upcoming" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSelectedTab("upcoming")}
          className={selectedTab === "upcoming" ? "bg-white shadow-sm" : ""}
        >
          Upcoming ({upcomingAppointments.length})
        </Button>
        <Button
          variant={selectedTab === "past" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSelectedTab("past")}
          className={selectedTab === "past" ? "bg-white shadow-sm" : ""}
        >
          Past ({pastAppointments.length})
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="Search appointments..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
          <SelectTrigger className="w-[200px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>
            <SelectItem value="cardiology">Cardiology</SelectItem>
            <SelectItem value="primary care">Primary Care</SelectItem>
            <SelectItem value="dermatology">Dermatology</SelectItem>
            <SelectItem value="mental health">Mental Health</SelectItem>
            <SelectItem value="pediatrics">Pediatrics</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Appointments List */}
      {selectedTab === "upcoming" && (
        <div className="space-y-4">
          {filteredUpcoming.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No upcoming appointments found.</p>
              </CardContent>
            </Card>
          ) : (
            filteredUpcoming.map((appointment: any) => (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Dr. {appointment.healthcare_providers?.first_name} {appointment.healthcare_providers?.last_name}
                        </h3>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{appointment.healthcare_providers?.specialty}</p>
                      {appointment.reason && (
                        <p className="text-sm text-gray-600 mb-2">{appointment.reason}</p>
                      )}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(appointment.appointment_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {appointment.appointment_time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {appointment.type.replace('_', ' ')}
                        </div>
                        {appointment.healthcare_providers?.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {appointment.healthcare_providers.phone}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <AddAppointmentDataForm 
                        appointmentId={appointment.id} 
                        onDataAdded={fetchAppointments} 
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReschedule(appointment)}
                      >
                        Reschedule
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {selectedTab === "past" && (
        <div className="space-y-4">
          {filteredPast.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No past appointments found.</p>
              </CardContent>
            </Card>
          ) : (
            filteredPast.map((appointment: any) => (
              <Card key={appointment.id} className="opacity-75">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Dr. {appointment.healthcare_providers?.first_name} {appointment.healthcare_providers?.last_name}
                        </h3>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{appointment.healthcare_providers?.specialty}</p>
                      {appointment.reason && (
                        <p className="text-sm text-gray-600 mb-2">{appointment.reason}</p>
                      )}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(appointment.appointment_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {appointment.appointment_time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {appointment.type.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <AddAppointmentDataForm 
                        appointmentId={appointment.id} 
                        onDataAdded={fetchAppointments} 
                      />
                      <Button variant="outline" size="sm">
                        View Notes
                      </Button>
                      <Button variant="outline" size="sm">
                        Book Again
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      <RescheduleAppointmentModal
        isOpen={rescheduleModal.isOpen}
        onClose={() => setRescheduleModal({ isOpen: false, appointment: null })}
        appointment={rescheduleModal.appointment}
        onReschedule={handleRescheduleComplete}
      />
    </div>
  );
};

export default Appointments;
