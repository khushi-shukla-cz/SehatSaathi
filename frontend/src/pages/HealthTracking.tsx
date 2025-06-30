
import { useState, useEffect } from "react";
import { Activity, Heart, Thermometer, Weight, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { AddHealthMetricForm } from "@/components/forms/AddHealthMetricForm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const HealthTracking = () => {
  const { user } = useAuth();
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHealthMetrics();
    }
  }, [user]);

  const fetchHealthMetrics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('patient_id', user?.id)
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      setHealthMetrics(data || []);
    } catch (error) {
      console.error('Error fetching health metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Process data for charts
  const getMetricsByType = (type: string) => {
    return healthMetrics
      .filter((metric: any) => metric.metric_type === type)
      .slice(0, 10)
      .reverse()
      .map((metric: any) => ({
        date: new Date(metric.recorded_at).toLocaleDateString(),
        value: parseFloat(metric.value),
        ...metric
      }));
  };

  const bloodPressureData = getMetricsByType('blood_pressure');
  const weightData = getMetricsByType('weight');
  const heartRateData = getMetricsByType('heart_rate');

  // Get latest readings
  const getLatestMetric = (type: string) => {
    const metrics = healthMetrics.filter((metric: any) => metric.metric_type === type);
    return metrics.length > 0 ? metrics[0] : null;
  };

  const vitalStats = [
    {
      label: "Blood Pressure",
      value: getLatestMetric('blood_pressure')?.value || "N/A",
      unit: getLatestMetric('blood_pressure')?.unit || "mmHg",
      trend: "stable",
      icon: Heart,
      color: "text-red-600"
    },
    {
      label: "Heart Rate",
      value: getLatestMetric('heart_rate')?.value || "N/A",
      unit: getLatestMetric('heart_rate')?.unit || "bpm",
      trend: "stable",
      icon: Activity,
      color: "text-blue-600"
    },
    {
      label: "Weight",
      value: getLatestMetric('weight')?.value || "N/A",
      unit: getLatestMetric('weight')?.unit || "lbs",
      trend: "stable",
      icon: Weight,
      color: "text-green-600"
    },
    {
      label: "Temperature",
      value: getLatestMetric('temperature')?.value || "N/A",
      unit: getLatestMetric('temperature')?.unit || "°F",
      trend: "stable",
      icon: Thermometer,
      color: "text-orange-600"
    }
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Health Tracking</h1>
          <p className="text-gray-600 mt-1">Monitor your vital signs and health metrics</p>
        </div>
        <AddHealthMetricForm onMetricAdded={fetchHealthMetrics} />
      </div>

      {/* Current Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {vitalStats.map((vital, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{vital.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {vital.value}
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      {vital.unit}
                    </span>
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className={`w-4 h-4 mr-1 ${
                      vital.trend === 'up' ? 'text-red-500 transform rotate-0' :
                      vital.trend === 'down' ? 'text-green-500 transform rotate-180' :
                      'text-gray-400 transform rotate-90'
                    }`} />
                    <span className="text-xs text-gray-500 capitalize">{vital.trend}</span>
                  </div>
                </div>
                <vital.icon className={`h-8 w-8 ${vital.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="charts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="charts">Charts & Trends</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Blood Pressure Chart */}
            {bloodPressureData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-600" />
                    Blood Pressure Trend
                  </CardTitle>
                  <CardDescription>Your blood pressure readings over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={bloodPressureData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Weight Chart */}
            {weightData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Weight className="w-5 h-5 mr-2 text-green-600" />
                    Weight Progress
                  </CardTitle>
                  <CardDescription>Your weight changes over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weightData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Heart Rate Chart */}
            {heartRateData.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-blue-600" />
                    Heart Rate Monitoring
                  </CardTitle>
                  <CardDescription>Recent heart rate measurements</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={heartRateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#2563eb" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {healthMetrics.length === 0 && (
              <Card className="lg:col-span-2">
                <CardContent className="p-6 text-center text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No health metrics recorded yet. Add your first reading to see charts.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Metrics History</CardTitle>
              <CardDescription>All your recorded health metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {healthMetrics.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No health metrics recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {healthMetrics.map((metric: any) => (
                    <div key={metric.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium text-gray-900 capitalize">
                            {metric.metric_type.replace('_', ' ')}
                          </h4>
                          <span className="text-lg font-semibold text-blue-600">
                            {metric.value} {metric.unit}
                          </span>
                        </div>
                        {metric.notes && (
                          <p className="text-sm text-gray-600 mt-1">{metric.notes}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(metric.recorded_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthTracking;
