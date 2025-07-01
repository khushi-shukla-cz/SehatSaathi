import React from "react";
import { Activity, Heart, Calendar, Pill, FileText, Users, Clock } from "lucide-react";
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-blue-400"></div>
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
      color: "text-blue-600 dark:text-blue-400",
      change: `${appointments.length} total`
    },
    {
      title: "Active Medications",
      value: activeMedications.length,
      icon: Pill,
      color: "text-green-600 dark:text-green-400",
      change: `${medications.length} total`
    },
    {
      title: "Health Records",
      value: medicalRecords.length,
      icon: FileText,
      color: "text-purple-600 dark:text-purple-400",
      change: "Total records"
    },
    {
      title: "Health Metrics",
      value: healthMetrics.length,
      icon: Activity,
      color: "text-orange-600 dark:text-orange-400",
      change: "Recorded readings"
    }
  ];

  return (
    <div className="space-y-10 px-2 md:px-6 py-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 min-h-screen transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Health Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1 text-lg">Your complete health overview</p>
        </div>
        <div className="flex gap-2">
          <AddHealthMetricForm onMetricAdded={refetchData} />
          <BookAppointmentForm onAppointmentBooked={refetchData} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow bg-white/80 dark:bg-gray-900/80 border-0">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-800 dark:to-gray-700 p-3 shadow-inner`}>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <Card className="bg-white/90 dark:bg-gray-900/90 border-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold">Upcoming Appointments</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/appointments')}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <div className="flex flex-col items-center py-8">
                <Calendar className="w-10 h-10 text-gray-300 dark:text-gray-700 mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-center">No upcoming appointments</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((appointment: any) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-blue-200 dark:bg-blue-900 w-10 h-10 flex items-center justify-center font-bold text-blue-700 dark:text-blue-300">
                        {appointment.healthcare_providers?.first_name?.[0] || "D"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          Dr. {appointment.healthcare_providers?.first_name} {appointment.healthcare_providers?.last_name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.healthcare_providers?.specialty}</p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          {new Date(appointment.appointment_date).toLocaleDateString()} at {appointment.appointment_time}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{appointment.type.replace('_', ' ')}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Medications */}
        <Card className="bg-white/90 dark:bg-gray-900/90 border-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="font-semibold">Active Medications</span>
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
              <div className="flex flex-col items-center py-8">
                <Pill className="w-10 h-10 text-gray-300 dark:text-gray-700 mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-center">No active medications</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeMedications.map((medication: any) => (
                  <div key={medication.id} className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/40 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-green-200 dark:bg-green-900 w-10 h-10 flex items-center justify-center font-bold text-green-700 dark:text-green-300">
                        {medication.name?.[0] || "M"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{medication.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{medication.dosage} • {medication.frequency}</p>
                        {medication.pills_remaining && (
                          <p className="text-sm text-green-600 dark:text-green-400">{medication.pills_remaining} pills remaining</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Health Metrics */}
        <Card className="bg-white/90 dark:bg-gray-900/90 border-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <span className="font-semibold">Recent Health Metrics</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/health-tracking')}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentMetrics.length === 0 ? (
              <div className="flex flex-col items-center py-8">
                <Activity className="w-10 h-10 text-gray-300 dark:text-gray-700 mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-center">No health metrics recorded</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMetrics.map((metric: any) => (
                  <div key={metric.id} className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/40 rounded-xl shadow-sm">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white capitalize">
                        {metric.metric_type.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {metric.value} {metric.unit}
                      </p>
                      <p className="text-sm text-orange-600 dark:text-orange-400">
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
        <Card className="bg-white/90 dark:bg-gray-900/90 border-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="font-semibold">Recent Records</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/records')}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentRecords.length === 0 ? (
              <div className="flex flex-col items-center py-8">
                <FileText className="w-10 h-10 text-gray-300 dark:text-gray-700 mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-center">No medical records</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRecords.map((record: any) => (
                  <div key={record.id} className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-950/40 rounded-xl shadow-sm">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{record.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {record.record_type.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-purple-600 dark:text-purple-400">
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
      <Card className="bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-gray-800 dark:to-gray-900 border-0 shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-white/80 dark:bg-gray-900/80 border-0 shadow hover:shadow-md transition" onClick={() => navigate('/telemedicine')} title="Start a video consultation">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span>Start Consultation</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-white/80 dark:bg-gray-900/80 border-0 shadow hover:shadow-md transition" onClick={() => navigate('/symptom-scanner')} title="Scan your symptoms">
              <Heart className="w-8 h-8 text-red-600 dark:text-red-400" />
              <span>Symptom Scanner</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-white/80 dark:bg-gray-900/80 border-0 shadow hover:shadow-md transition" onClick={() => navigate('/messages')} title="View your messages">
              <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />
              <span>Messages</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
