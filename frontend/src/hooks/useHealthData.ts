
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useHealthData = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [medications, setMedications] = useState([]);
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      ensureProfileExists();
    }
  }, [user]);

  const ensureProfileExists = async () => {
    if (!user) return;
    
    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        // Create profile if it doesn't exist
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
        }
      }
      
      // Now fetch all data
      await fetchAllData();
    } catch (error) {
      console.error('Error ensuring profile exists:', error);
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchAppointments(),
        fetchMedications(),
        fetchHealthMetrics(),
        fetchMedicalRecords()
      ]);
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        healthcare_providers (
          first_name,
          last_name,
          specialty
        )
      `)
      .eq('patient_id', user?.id)
      .order('appointment_date', { ascending: true });

    if (error) {
      console.error('Error fetching appointments:', error);
    } else {
      setAppointments(data || []);
    }
  };

  const fetchMedications = async () => {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('patient_id', user?.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching medications:', error);
    } else {
      setMedications(data || []);
    }
  };

  const fetchHealthMetrics = async () => {
    const { data, error } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('patient_id', user?.id)
      .order('recorded_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching health metrics:', error);
    } else {
      setHealthMetrics(data || []);
    }
  };

  const fetchMedicalRecords = async () => {
    const { data, error } = await supabase
      .from('medical_records')
      .select('*')
      .eq('patient_id', user?.id)
      .order('record_date', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching medical records:', error);
    } else {
      setMedicalRecords(data || []);
    }
  };

  return {
    appointments,
    medications,
    healthMetrics,
    medicalRecords,
    loading,
    refetchData: fetchAllData
  };
};
