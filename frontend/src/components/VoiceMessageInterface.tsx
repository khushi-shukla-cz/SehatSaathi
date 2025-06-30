
import { useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceInterface } from '@/hooks/useVoiceInterface';

interface VoiceMessageInterfaceProps {
  onVoiceMessage: (message: string) => void;
  lastDoctorMessage?: string;
}

const VoiceMessageInterface = ({ onVoiceMessage, lastDoctorMessage }: VoiceMessageInterfaceProps) => {
  const { 
    isRecording, 
    isPlaying, 
    startRecording, 
    stopRecording, 
    processVoiceMessage,
    playVoiceMessage,
    stopPlaying 
  } = useVoiceInterface();

  const handleVoiceRecord = async () => {
    if (isRecording) {
      stopRecording();
      // Simulate processing the recorded audio
      setTimeout(async () => {
        const transcribed = await processVoiceMessage(new Blob());
        onVoiceMessage(transcribed);
      }, 1000);
    } else {
      startRecording();
    }
  };

  const handlePlayLastMessage = () => {
    if (isPlaying) {
      stopPlaying();
    } else if (lastDoctorMessage) {
      playVoiceMessage(lastDoctorMessage);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isRecording ? "destructive" : "outline"}
        size="sm"
        onClick={handleVoiceRecord}
        className={isRecording ? "animate-pulse" : ""}
      >
        {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </Button>
      
      {lastDoctorMessage && (
        <Button
          variant="outline"
          size="sm"
          onClick={handlePlayLastMessage}
          disabled={!lastDoctorMessage}
        >
          {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
      )}
    </div>
  );
};

export default VoiceMessageInterface;
