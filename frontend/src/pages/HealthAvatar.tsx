
import { useState, useEffect } from "react";
import { User, TrendingUp, Zap, Heart, Droplets, Dumbbell, Brain, Eye, Share2, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const HealthAvatar = () => {
  const [avatarLevel, setAvatarLevel] = useState(7);
  const [hydrationLevel, setHydrationLevel] = useState([75]);
  const [fitnessLevel, setFitnessLevel] = useState([65]);
  const [sleepQuality, setSleepQuality] = useState([80]);
  const [stressLevel, setStressLevel] = useState([30]);
  const [selectedTimeframe, setSelectedTimeframe] = useState("current");
  const { toast } = useToast();

  const healthMetrics = [
    { label: "Hydration", value: hydrationLevel[0], icon: Droplets, color: "blue", effect: "Glowing skin" },
    { label: "Fitness", value: fitnessLevel[0], icon: Dumbbell, color: "green", effect: "Muscle definition" },
    { label: "Sleep", value: sleepQuality[0], icon: Brain, color: "purple", effect: "Bright eyes" },
    { label: "Stress", value: 100 - stressLevel[0], icon: Heart, color: "red", effect: "Calm aura" }
  ];

  const avatarStyles = {
    skinGlow: hydrationLevel[0] > 70 ? "brightness-110" : "brightness-100",
    muscleDefinition: fitnessLevel[0] > 60 ? "contrast-110" : "contrast-100",
    eyeBrightness: sleepQuality[0] > 70 ? "saturate-110" : "saturate-100",
    auraCalm: stressLevel[0] < 40 ? "drop-shadow-lg" : "drop-shadow-none"
  };

  const projections = {
    "1week": {
      hydration: Math.min(hydrationLevel[0] + 10, 100),
      fitness: Math.min(fitnessLevel[0] + 5, 100),
      sleep: Math.min(sleepQuality[0] + 8, 100),
      stress: Math.max(stressLevel[0] - 5, 0)
    },
    "1month": {
      hydration: Math.min(hydrationLevel[0] + 20, 100),
      fitness: Math.min(fitnessLevel[0] + 15, 100),
      sleep: Math.min(sleepQuality[0] + 15, 100),
      stress: Math.max(stressLevel[0] - 15, 0)
    },
    "3months": {
      hydration: Math.min(hydrationLevel[0] + 25, 100),
      fitness: Math.min(fitnessLevel[0] + 30, 100),
      sleep: Math.min(sleepQuality[0] + 20, 100),
      stress: Math.max(stressLevel[0] - 25, 0)
    }
  };

  const handleShareAvatar = () => {
    toast({
      title: "Avatar Shared! 🎉",
      description: "Your health avatar has been shared with friends!",
    });
  };

  const handleDownloadAvatar = () => {
    toast({
      title: "Avatar Downloaded! 📥",
      description: "Your 3D avatar model has been saved to your device.",
    });
  };

  const handleLevelUp = () => {
    setAvatarLevel(avatarLevel + 1);
    toast({
      title: "Level Up! 🎮",
      description: `Congratulations! Your avatar reached level ${avatarLevel + 1}!`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <User className="w-8 h-8 mr-3 text-purple-600" />
            Health Avatar
          </h1>
          <p className="text-gray-600 mt-1">Your Dynamic 3D Health Companion</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="text-lg px-3 py-1">
            Level {avatarLevel}
          </Badge>
          <Button onClick={handleLevelUp} variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            Level Up
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 3D Avatar Visualization */}
        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle>Your Health Avatar</CardTitle>
            <CardDescription>Visual representation of your current health status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* 3D Avatar Placeholder - In a real app, this would be a 3D model */}
              <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div 
                  className={`w-48 h-72 bg-gradient-to-b from-pink-200 to-pink-300 rounded-full relative transform transition-all duration-1000 ${avatarStyles.skinGlow} ${avatarStyles.muscleDefinition} ${avatarStyles.eyeBrightness} ${avatarStyles.auraCalm}`}
                  style={{
                    clipPath: "ellipse(40% 50% at 50% 40%)"
                  }}
                >
                  {/* Head */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-20 bg-gradient-to-b from-pink-200 to-pink-300 rounded-full">
                    {/* Eyes */}
                    <div className="absolute top-6 left-2 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    <div className="absolute top-6 right-2 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    {/* Smile */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-gray-600 rounded-full"></div>
                  </div>
                  
                  {/* Body Effects */}
                  {hydrationLevel[0] > 70 && (
                    <div className="absolute inset-0 bg-blue-200 opacity-30 rounded-full animate-pulse"></div>
                  )}
                  {fitnessLevel[0] > 60 && (
                    <div className="absolute top-1/3 left-1/4 w-1/2 h-1/3 bg-green-200 opacity-40 rounded-lg"></div>
                  )}
                  {stressLevel[0] < 40 && (
                    <div className="absolute -inset-4 bg-gradient-to-r from-green-200 to-blue-200 opacity-20 rounded-full blur-md"></div>
                  )}
                </div>
                
                {/* Level indicator */}
                <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                  <span className="text-sm font-bold text-purple-600">Lv.{avatarLevel}</span>
                </div>

                {/* Health status indicators */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-2">
                  {healthMetrics.map((metric, index) => (
                    <div key={index} className={`w-3 h-3 rounded-full bg-${metric.color}-500 ${
                      metric.value > 70 ? 'animate-pulse' : ''
                    }`}></div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center space-x-4 mt-4">
                <Button onClick={handleShareAvatar} variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Avatar
                </Button>
                <Button onClick={handleDownloadAvatar} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download 3D Model
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Metrics Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Health Metrics</CardTitle>
            <CardDescription>Adjust your current health status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Droplets className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium">Hydration</span>
                </div>
                <span className="text-sm text-gray-600">{hydrationLevel[0]}%</span>
              </div>
              <Slider
                value={hydrationLevel}
                onValueChange={setHydrationLevel}
                max={100}
                step={1}
                className="mb-2"
              />
              <p className="text-xs text-gray-500">Effect: Glowing, healthy skin</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Dumbbell className="w-4 h-4 mr-2 text-green-600" />
                  <span className="font-medium">Fitness</span>
                </div>
                <span className="text-sm text-gray-600">{fitnessLevel[0]}%</span>
              </div>
              <Slider
                value={fitnessLevel}
                onValueChange={setFitnessLevel}
                max={100}
                step={1}
                className="mb-2"
              />
              <p className="text-xs text-gray-500">Effect: Muscle definition and posture</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Brain className="w-4 h-4 mr-2 text-purple-600" />
                  <span className="font-medium">Sleep Quality</span>
                </div>
                <span className="text-sm text-gray-600">{sleepQuality[0]}%</span>
              </div>
              <Slider
                value={sleepQuality}
                onValueChange={setSleepQuality}
                max={100}
                step={1}
                className="mb-2"
              />
              <p className="text-xs text-gray-500">Effect: Bright, alert eyes</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-red-600" />
                  <span className="font-medium">Stress Level</span>
                </div>
                <span className="text-sm text-gray-600">{stressLevel[0]}%</span>
              </div>
              <Slider
                value={stressLevel}
                onValueChange={setStressLevel}
                max={100}
                step={1}
                className="mb-2"
              />
              <p className="text-xs text-gray-500">Effect: Calm, peaceful aura</p>
            </div>
          </CardContent>
        </Card>

        {/* What If Projections */}
        <Card>
          <CardHeader>
            <CardTitle>What If? Future Projections</CardTitle>
            <CardDescription>See how your avatar could evolve</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="1week" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="1week">1 Week</TabsTrigger>
                <TabsTrigger value="1month">1 Month</TabsTrigger>
                <TabsTrigger value="3months">3 Months</TabsTrigger>
              </TabsList>

              {Object.entries(projections).map(([timeframe, projection]) => (
                <TabsContent key={timeframe} value={timeframe} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <Droplets className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="text-sm">Hydration</span>
                      </div>
                      <Progress value={projection.hydration} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">{projection.hydration}%</p>
                    </div>
                    <div>
                      <div className="flex items-center mb-2">
                        <Dumbbell className="w-4 h-4 mr-2 text-green-600" />
                        <span className="text-sm">Fitness</span>
                      </div>
                      <Progress value={projection.fitness} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">{projection.fitness}%</p>
                    </div>
                    <div>
                      <div className="flex items-center mb-2">
                        <Brain className="w-4 h-4 mr-2 text-purple-600" />
                        <span className="text-sm">Sleep</span>
                      </div>
                      <Progress value={projection.sleep} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">{projection.sleep}%</p>
                    </div>
                    <div>
                      <div className="flex items-center mb-2">
                        <Heart className="w-4 h-4 mr-2 text-red-600" />
                        <span className="text-sm">Stress (Low)</span>
                      </div>
                      <Progress value={100 - projection.stress} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">{100 - projection.stress}%</p>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      <strong>Projection:</strong> If you maintain current habits for {timeframe.replace(/(\d+)/, '$1 ')}, 
                      your avatar will show significant improvements in all health metrics!
                    </p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthAvatar;
