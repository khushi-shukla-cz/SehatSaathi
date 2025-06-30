
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useVoiceInterface = () => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        processVoiceMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Speak your message now...",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Access",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      toast({
        title: "Recording Stopped",
        description: "Processing your voice message...",
      });
    }
  };

  const processVoiceMessage = async (audioBlob: Blob) => {
    // Simulate voice-to-text conversion with more realistic medical queries
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const medicalQueries = [
      "Doctor, I've been having headaches for the past three days. They seem to get worse in the afternoon.",
      "I'm experiencing some chest discomfort and wanted to check if I should be concerned about it.",
      "Can you help me understand the side effects of my new blood pressure medication?",
      "I've been feeling very tired lately and having trouble sleeping. What could be causing this?",
      "I have a persistent cough that's been going on for about a week now. Should I be worried?",
      "My back pain has been getting worse. What exercises or treatments would you recommend?",
      "I'm feeling anxious about an upcoming procedure. Can you help me understand what to expect?",
      "I've noticed some changes in my appetite and weight. What could be the possible causes?",
      "Can you explain my recent lab results? I'm not sure what the numbers mean.",
      "I'm having trouble managing my stress levels. Do you have any recommendations?",
    ];
    
    const randomQuery = medicalQueries[Math.floor(Math.random() * medicalQueries.length)];
    
    return randomQuery;
  };

  const playVoiceMessage = async (text: string) => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Use a more professional voice if available
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.lang.startsWith('en')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Speech Not Supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive"
      });
    }
  };

  const stopPlaying = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  return {
    isRecording,
    isPlaying,
    startRecording,
    stopRecording,
    processVoiceMessage,
    playVoiceMessage,
    stopPlaying
  };
};
