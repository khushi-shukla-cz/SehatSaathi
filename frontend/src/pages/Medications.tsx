
import { useState, useEffect } from "react";
import { Pill, Clock, Plus, Bell, RefreshCw, AlertTriangle, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { AddMedicationForm } from "@/components/forms/AddMedicationForm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Medications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMedications();
    }
  }, [user]);

  const fetchMedications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('patient_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedications(data || []);
    } catch (error) {
      console.error('Error fetching medications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsTaken = async (medicationId: string) => {
    try {
      const medication = medications.find((med: any) => med.id === medicationId);
      if (!medication || !medication.pills_remaining) return;

      const { error } = await supabase
        .from('medications')
        .update({ 
          pills_remaining: medication.pills_remaining - 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', medicationId);

      if (error) throw error;

      toast({
        title: "Medication Taken",
        description: "Medication marked as taken and pill count updated.",
      });

      fetchMedications();
    } catch (error) {
      console.error('Error updating medication:', error);
      toast({
        title: "Error",
        description: "Failed to update medication. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMedication = async (medicationId: string) => {
    try {
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', medicationId);

      if (error) throw error;

      toast({
        title: "Medication Deleted",
        description: "Medication has been removed from your list.",
      });

      fetchMedications();
    } catch (error) {
      console.error('Error deleting medication:', error);
      toast({
        title: "Error",
        description: "Failed to delete medication. Please try again.",
        variant: "destructive"
      });
    }
  };

  const activeMedications = medications.filter((med: any) => med.is_active);
  const needRefill = activeMedications.filter((med: any) => med.pills_remaining && med.pills_remaining <= 10);

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
          <h1 className="text-3xl font-bold text-gray-900">Medications</h1>
          <p className="text-gray-600 mt-1">Manage your medications and reminders</p>
        </div>
        <AddMedicationForm onMedicationAdded={fetchMedications} />
      </div>

      {/* Reminder Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="w-5 h-5 mr-2 text-blue-600" />
              Medication Reminders
            </div>
            <Switch
              checked={reminderEnabled}
              onCheckedChange={setReminderEnabled}
            />
          </CardTitle>
          <CardDescription>
            Get notified when it's time to take your medications
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Refill Alerts */}
      {needRefill.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Refill Needed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {needRefill.map((med: any, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{med.name}</p>
                    <p className="text-sm text-gray-600">{med.pills_remaining} pills remaining</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Request Refill
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medications List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Medications</h2>
        {activeMedications.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              <Pill className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No medications found. Add your first medication to get started.</p>
            </CardContent>
          </Card>
        ) : (
          activeMedications.map((medication: any) => (
            <Card key={medication.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Pill className="w-5 h-5 mr-2 text-blue-600" />
                      {medication.name}
                    </h3>
                    <p className="text-gray-600">{medication.dosage} • {medication.frequency}</p>
                    <p className="text-sm text-gray-500">
                      Started: {new Date(medication.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge 
                    variant={medication.is_active ? "default" : "secondary"}
                    className={medication.is_active ? "bg-green-600" : "bg-gray-500"}
                  >
                    {medication.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {medication.pills_total && (
                  <div className="space-y-3 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Pills remaining:</span>
                        <span className="font-medium text-gray-900">
                          {medication.pills_remaining || 0} of {medication.pills_total}
                        </span>
                      </div>
                      <Progress 
                        value={((medication.pills_remaining || 0) / medication.pills_total) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                )}

                {medication.instructions && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>Instructions:</strong> {medication.instructions}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  {medication.pills_remaining && medication.pills_remaining > 0 && (
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleMarkAsTaken(medication.id)}
                    >
                      Mark as Taken
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteMedication(medication.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Medications;
