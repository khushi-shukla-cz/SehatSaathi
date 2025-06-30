
import { useState, useRef, useEffect } from "react";
import { Phone, Mic, MicOff, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface PhoneCallInterfaceProps {
  isActive: boolean;
  onEnd: () => void;
  doctorName: string;
}

const PhoneCallInterface = ({ isActive, onEnd, doctorName }: PhoneCallInterfaceProps) => {
  const { toast } = useToast();
  const [isMicOn, setIsMicOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isOnHold, setIsOnHold] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<MediaStream>();

  useEffect(() => {
    if (isActive) {
      // Start call timer
      intervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      // Initialize audio stream
      initializeAudio();

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        stopAudio();
      };
    }
  }, [isActive]);

  const initializeAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioRef.current = stream;
      
      toast({
        title: "Call Connected",
        description: `Connected to ${doctorName}`,
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Access",
        description: "Unable to access microphone.",
        variant: "destructive"
      });
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    if (audioRef.current) {
      const audioTrack = audioRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
      }
    }
  };

  const toggleHold = () => {
    setIsOnHold(!isOnHold);
    toast({
      title: isOnHold ? "Call Resumed" : "Call On Hold",
      description: isOnHold ? "Call resumed" : "Call placed on hold",
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    stopAudio();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCallDuration(0);
    onEnd();
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-purple-900 z-50 flex flex-col items-center justify-center">
      <div className="text-center text-white mb-8">
        <Avatar className="w-40 h-40 mx-auto mb-6 border-4 border-white">
          <AvatarFallback className="bg-blue-600 text-white text-4xl">
            {doctorName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-3xl font-bold mb-2">{doctorName}</h2>
        <p className="text-xl text-blue-200 mb-2">
          {isOnHold ? "On Hold" : "Connected"}
        </p>
        <p className="text-lg text-blue-300">{formatDuration(callDuration)}</p>
      </div>

      {/* Call controls */}
      <div className="flex items-center gap-6">
        <Button
          variant={isMicOn ? "default" : "destructive"}
          size="lg"
          className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/30 border-2 border-white"
          onClick={toggleMic}
        >
          {isMicOn ? <Mic className="w-7 h-7" /> : <MicOff className="w-7 h-7" />}
        </Button>

        <Button
          variant={isOnHold ? "default" : "secondary"}
          size="lg"
          className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/30 border-2 border-white"
          onClick={toggleHold}
        >
          {isOnHold ? <Play className="w-7 h-7" /> : <Pause className="w-7 h-7" />}
        </Button>

        <Button
          variant="destructive"
          size="lg"
          className="rounded-full w-20 h-20 bg-red-600 hover:bg-red-700"
          onClick={handleEndCall}
        >
          <Phone className="w-8 h-8 rotate-[135deg]" />
        </Button>
      </div>

      {/* Status indicators */}
      <div className="absolute bottom-8 text-center text-white/70">
        <p className="text-sm">
          {isMicOn ? "Microphone is on" : "Microphone is muted"} • 
          {isOnHold ? " Call on hold" : " Call active"}
        </p>
      </div>
    </div>
  );
};

export default PhoneCallInterface;
