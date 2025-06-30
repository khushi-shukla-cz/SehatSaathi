import { useState } from "react";
import { Video, MessageSquare, Calendar, Clock, User, Phone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import VideoCallInterface from "@/components/VideoCallInterface";
import PhoneCallInterface from "@/components/PhoneCallInterface";
import MessagingInterface from "@/components/MessagingInterface";

const Telemedicine = () => {
  const [activeVideoCall, setActiveVideoCall] = useState(false);
  const [activePhoneCall, setActivePhoneCall] = useState(false);
  const [activeMessaging, setActiveMessaging] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("Dr. Sarah Johnson");
  const { toast } = useToast();

  const handleStartVideoConsultation = () => {
    toast({
      title: "Starting Video Consultation",
      description: "Connecting you to a healthcare provider...",
    });
    setActiveVideoCall(true);
  };

  const handleVideoCall = () => {
    toast({
      title: "Video Call Starting",
      description: "Launching video consultation...",
    });
    setActiveVideoCall(true);
  };

  const handlePhoneCall = () => {
    toast({
      title: "Phone Call Initiated",
      description: "Connecting via phone...",
    });
    setActivePhoneCall(true);
  };

  const handleStartMessage = () => {
    toast({
      title: "Secure Messaging",
      description: "Opening secure message interface...",
    });
    setActiveMessaging(true);
  };

  const handleConnectToDoctor = (doctorName: string) => {
    setSelectedDoctor(doctorName);
    toast({
      title: "Starting Consultation",
      description: `Connecting you to ${doctorName}...`,
    });
    setActiveVideoCall(true);
  };

  const upcomingConsultations = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      date: "Today",
      time: "2:00 PM",
      type: "Video Call",
      status: "scheduled"
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Primary Care",
      date: "Tomorrow",
      time: "10:30 AM",
      type: "Phone Call",
      status: "scheduled"
    }
  ];

  const availableDoctors = [
    {
      name: "Dr. Emily Rodriguez",
      specialty: "Dermatology",
      availability: "Available now",
      rating: 4.9,
      status: "online"
    },
    {
      name: "Dr. James Wilson",
      specialty: "Mental Health",
      availability: "Available in 15 min",
      rating: 4.8,
      status: "busy"
    }
  ];

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Telemedicine</h1>
            <p className="text-gray-600 mt-1">Connect with healthcare professionals remotely</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            onClick={handleStartVideoConsultation}
          >
            <Video className="w-4 h-4 mr-2" />
            Start Consultation
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Consultations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Upcoming Consultations
              </CardTitle>
              <CardDescription>Your scheduled virtual appointments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingConsultations.map((consultation) => (
                <div key={consultation.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-600 text-white">
                        {consultation.doctor.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{consultation.doctor}</p>
                      <p className="text-sm text-gray-600">{consultation.specialty}</p>
                      <p className="text-sm text-blue-600">{consultation.date} at {consultation.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-blue-200">
                      {consultation.type}
                    </Badge>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        setSelectedDoctor(consultation.doctor);
                        consultation.type === "Video Call" ? handleVideoCall() : handlePhoneCall();
                      }}
                    >
                      {consultation.type === "Video Call" ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Available Doctors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-green-600" />
                Available Now
              </CardTitle>
              <CardDescription>Doctors ready for immediate consultation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableDoctors.map((doctor, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback className="bg-green-600 text-white">
                          {doctor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        doctor.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doctor.name}</p>
                      <p className="text-sm text-gray-600">{doctor.specialty}</p>
                      <p className="text-sm text-green-600">{doctor.availability}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleConnectToDoctor(doctor.name)}
                  >
                    Connect
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleVideoCall}>
            <CardContent className="p-6 text-center">
              <Video className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Video Consultation</h3>
              <p className="text-gray-600 text-sm mb-4">Face-to-face consultation with your doctor</p>
              <Button variant="outline" className="w-full">Start Video Call</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handlePhoneCall}>
            <CardContent className="p-6 text-center">
              <Phone className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Phone Consultation</h3>
              <p className="text-gray-600 text-sm mb-4">Voice-only consultation for quick queries</p>
              <Button variant="outline" className="w-full">Start Phone Call</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleStartMessage}>
            <CardContent className="p-6 text-center">
              <MessageSquare className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure Messaging</h3>
              <p className="text-gray-600 text-sm mb-4">Send secure messages to your healthcare team</p>
              <Button variant="outline" className="w-full">Send Message</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Interface Components */}
      <VideoCallInterface 
        isActive={activeVideoCall} 
        onEnd={() => setActiveVideoCall(false)}
        doctorName={selectedDoctor}
      />
      <PhoneCallInterface 
        isActive={activePhoneCall} 
        onEnd={() => setActivePhoneCall(false)}
        doctorName={selectedDoctor}
      />
      <MessagingInterface 
        isActive={activeMessaging} 
        onClose={() => setActiveMessaging(false)}
        doctorName={selectedDoctor}
      />
    </>
  );
};

export default Telemedicine;
