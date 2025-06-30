
import React from "react";
import { Activity, Heart, Calendar, Pill, FileText, Users, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useHealthData } from "@/hooks/useHealthData";
import { AddMedicationForm } from "@/components/forms/AddMedicationForm";
import { AddHealthMetricForm } from "@/components/forms/AddHealthMetricForm";
import { BookAppointmentForm } from "@/components/forms/BookAppointmentForm";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { appointments, medications, healthMetrics, medicalRecords, loading, refetchData } = useHealthData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter((apt: any) => 
    new Date(`${apt.appointment_date}T${apt.appointment_time}`) > new Date()
  ).slice(0, 3);

  const activeMedications = medications.filter((med: any) => med.is_active).slice(0, 3);
  const recentMetrics = healthMetrics.slice(0, 3);
  const recentRecords = medicalRecords.slice(0, 3);

  const stats = [
    {
      title: "Upcoming Appointments",
      value: upcomingAppointments.length,
      icon: Calendar,
      color: "text-blue-600",
      change: `${appointments.length} total`
    },
    {
      title: "Active Medications",
      value: activeMedications.length,
      icon: Pill,
      color: "text-green-600",
      change: `${medications.length} total`
    },
    {
      title: "Health Records",
      value: medicalRecords.length,
      icon: FileText,
      color: "text-purple-600",
      change: "Total records"
    },
    {
      title: "Health Metrics",
      value: healthMetrics.length,
      icon: Activity,
      color: "text-orange-600",
      change: "Recorded readings"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Dashboard</h1>
          <p className="text-gray-600 mt-1">Your complete health overview</p>
        </div>
        <div className="flex gap-2">
          <AddHealthMetricForm onMetricAdded={refetchData} />
          <BookAppointmentForm onAppointmentBooked={refetchData} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Upcoming Appointments
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/appointments')}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((appointment: any) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        Dr. {appointment.healthcare_providers?.first_name} {appointment.healthcare_providers?.last_name}
                      </p>
                      <p className="text-sm text-gray-600">{appointment.healthcare_providers?.specialty}</p>
                      <p className="text-sm text-blue-600">
                        {new Date(appointment.appointment_date).toLocaleDateString()} at {appointment.appointment_time}
                      </p>
                    </div>
                    <Badge variant="outline">{appointment.type.replace('_', ' ')}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Medications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Pill className="w-5 h-5 mr-2 text-green-600" />
                Active Medications
              </div>
              <div className="flex gap-2">
                <AddMedicationForm onMedicationAdded={refetchData} />
                <Button variant="outline" size="sm" onClick={() => navigate('/medications')}>
                  View All
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeMedications.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No active medications</p>
            ) : (
              <div className="space-y-3">
                {activeMedications.map((medication: any) => (
                  <div key={medication.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{medication.name}</p>
                      <p className="text-sm text-gray-600">{medication.dosage} • {medication.frequency}</p>
                      {medication.pills_remaining && (
                        <p className="text-sm text-green-600">{medication.pills_remaining} pills remaining</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Health Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-orange-600" />
                Recent Health Metrics
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/health-tracking')}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentMetrics.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No health metrics recorded</p>
            ) : (
              <div className="space-y-3">
                {recentMetrics.map((metric: any) => (
                  <div key={metric.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {metric.metric_type.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {metric.value} {metric.unit}
                      </p>
                      <p className="text-sm text-orange-600">
                        {new Date(metric.recorded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Medical Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-purple-600" />
                Recent Records
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/records')}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentRecords.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No medical records</p>
            ) : (
              <div className="space-y-3">
                {recentRecords.map((record: any) => (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{record.title}</p>
                      <p className="text-sm text-gray-600 capitalize">
                        {record.record_type.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-purple-600">
                        {new Date(record.record_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" onClick={() => navigate('/telemedicine')}>
              <Users className="w-8 h-8 text-blue-600" />
              <span>Start Consultation</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" onClick={() => navigate('/symptom-scanner')}>
              <Heart className="w-8 h-8 text-red-600" />
              <span>Symptom Scanner</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" onClick={() => navigate('/messages')}>
              <Clock className="w-8 h-8 text-green-600" />
              <span>Messages</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
