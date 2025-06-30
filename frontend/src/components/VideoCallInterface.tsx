
import { useState, useRef, useEffect } from "react";
import { Video, VideoOff, Mic, MicOff, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface VideoCallInterfaceProps {
  isActive: boolean;
  onEnd: () => void;
  doctorName: string;
}

const VideoCallInterface = ({ isActive, onEnd, doctorName }: VideoCallInterfaceProps) => {
  const { toast } = useToast();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isActive) {
      // Start call timer
      intervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      // Initialize video stream
      initializeVideo();

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        stopVideo();
      };
    }
  }, [isActive]);

  const initializeVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Access",
        description: "Unable to access camera. Video call will continue with audio only.",
        variant: "destructive"
      });
    }
  };

  const stopVideo = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
      }
    }
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    stopVideo();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCallDuration(0);
    onEnd();
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Doctor's video area */}
      <div className="flex-1 relative bg-gray-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-green-500">
              <AvatarFallback className="bg-green-600 text-white text-3xl">
                {doctorName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold">{doctorName}</h2>
            <p className="text-green-400">Connected • {formatDuration(callDuration)}</p>
          </div>
        </div>
      </div>

      {/* User's video area */}
      <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          className={`w-full h-full object-cover ${!isVideoOn ? 'hidden' : ''}`}
        />
        {!isVideoOn && (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <VideoOff className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 bg-gray-900 flex justify-center items-center gap-4">
        <Button
          variant={isMicOn ? "default" : "destructive"}
          size="lg"
          className="rounded-full w-14 h-14"
          onClick={toggleMic}
        >
          {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </Button>

        <Button
          variant={isVideoOn ? "default" : "secondary"}
          size="lg"
          className="rounded-full w-14 h-14"
          onClick={toggleVideo}
        >
          {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </Button>

        <Button
          variant="destructive"
          size="lg"
          className="rounded-full w-14 h-14"
          onClick={handleEndCall}
        >
          <Phone className="w-6 h-6 rotate-[135deg]" />
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="rounded-full w-14 h-14 text-white border-white hover:bg-white hover:text-black"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default VideoCallInterface;
