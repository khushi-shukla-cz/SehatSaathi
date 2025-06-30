import { useState, useEffect } from "react";
import { Brain, Trophy, Flame, Heart, Calendar, Star, Target, Award, MessageCircle, Mic, MicOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import AIChatAssistant from "@/components/AIChatAssistant";

const AIHealthCoach = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(7);
  const [dailyProgress, setDailyProgress] = useState(65);
  const [moodInput, setMoodInput] = useState("");
  const [checkInComplete, setCheckInComplete] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const badges = [
    { name: "7-Day Streak", icon: Flame, earned: true, color: "bg-orange-500" },
    { name: "Hydration Hero", icon: Trophy, earned: true, color: "bg-blue-500" },
    { name: "Sleep Master", icon: Star, earned: false, color: "bg-purple-500" },
    { name: "Fitness Warrior", icon: Target, earned: true, color: "bg-green-500" },
    { name: "Wellness Champion", icon: Award, earned: false, color: "bg-yellow-500" }
  ];

  const challenges = [
    { id: 1, title: "Drink 2L Water Today", progress: 75, target: 100, reward: "10 XP" },
    { id: 2, title: "Take 8,000 Steps", progress: 45, target: 100, reward: "15 XP" },
    { id: 3, title: "Meditate for 10 Minutes", progress: 0, target: 100, reward: "20 XP" },
    { id: 4, title: "Sleep 8 Hours Tonight", progress: 0, target: 100, reward: "25 XP" }
  ];

  const aiInsights = [
    {
      time: "3:00 PM",
      insight: "Your heart rate spikes around this time daily. Try a 5-minute breathing exercise!",
      type: "warning"
    },
    {
      time: "Morning",
      insight: "Great job on your 7-day wellness streak! You're building amazing habits.",
      type: "success"
    },
    {
      time: "Evening",
      insight: "Your sleep was restless last night. Consider reducing screen time before bed.",
      type: "info"
    }
  ];

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast({
        title: "Voice Recording Started",
        description: "Tell me how you're feeling today...",
      });
      // Simulate voice recognition
      setTimeout(() => {
        setIsListening(false);
        setMoodInput("Feeling good today, a bit tired but energetic overall!");
        toast({
          title: "Voice Recorded",
          description: "Thanks for sharing! I've analyzed your mood.",
        });
      }, 3000);
    }
  };

  const handleDailyCheckIn = () => {
    setCheckInComplete(true);
    setDailyProgress(Math.min(dailyProgress + 20, 100));
    toast({
      title: "Daily Check-in Complete! 🎉",
      description: "Great job staying consistent with your health journey!",
    });
  };

  const handleChallengeComplete = (challengeId: number) => {
    toast({
      title: "Challenge Completed! 🏆",
      description: "You've earned XP and are one step closer to your goals!",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Brain className="w-8 h-8 mr-3 text-blue-600" />
            AI Health Coach
          </h1>
          <p className="text-gray-600 mt-1">Your 24/7 Personal Health Buddy</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="flex items-center space-x-1">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-2xl font-bold text-orange-500">{currentStreak}</span>
            </div>
            <p className="text-xs text-gray-500">Day Streak</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{dailyProgress}%</div>
            <p className="text-xs text-gray-500">Today's Goals</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="checkin" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="checkin">Daily Check-in</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>

        <TabsContent value="checkin" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
                  Daily Check-in
                </CardTitle>
                <CardDescription>How are you feeling today?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="mood">Describe your mood and energy level</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input
                      id="mood"
                      placeholder="Type how you're feeling..."
                      value={moodInput}
                      onChange={(e) => setMoodInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant={isListening ? "destructive" : "outline"}
                      size="icon"
                      onClick={handleVoiceToggle}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                  </div>
                  {isListening && (
                    <p className="text-sm text-blue-600 mt-2 animate-pulse">
                      🎤 Listening... Speak naturally about how you feel
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Energy Level (1-10)</Label>
                    <Input type="number" min="1" max="10" placeholder="7" className="mt-1" />
                  </div>
                  <div>
                    <Label>Sleep Quality (1-10)</Label>
                    <Input type="number" min="1" max="10" placeholder="8" className="mt-1" />
                  </div>
                </div>

                <Button 
                  onClick={handleDailyCheckIn} 
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  disabled={checkInComplete}
                >
                  {checkInComplete ? "✅ Check-in Complete!" : "Complete Daily Check-in"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Coach Response</CardTitle>
                <CardDescription>Based on your input and patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">
                      <strong>Great to hear you're feeling energetic!</strong> I noticed your sleep quality has improved this week. Keep maintaining that 8-hour sleep schedule - it's really paying off!
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800">
                      <strong>Recommendation:</strong> Since you mentioned being a bit tired, try the "Energy Boost" breathing exercise after lunch. It takes just 3 minutes!
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Heart className="w-4 h-4 mr-2" />
                    Start 3-Minute Energy Boost
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  <CardDescription>Reward: {challenge.reward}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{challenge.progress}%</span>
                    </div>
                    <Progress value={challenge.progress} className="h-2" />
                  </div>
                  <Button 
                    onClick={() => handleChallengeComplete(challenge.id)}
                    className="w-full"
                    variant={challenge.progress === 100 ? "default" : "outline"}
                    disabled={challenge.progress === 100}
                  >
                    {challenge.progress === 100 ? "✅ Completed!" : "Mark as Done"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Health Insights</CardTitle>
              <CardDescription>Personalized recommendations based on your data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${
                    insight.type === 'warning' ? 'border-orange-200 bg-orange-50' :
                    insight.type === 'success' ? 'border-green-200 bg-green-50' :
                    'border-blue-200 bg-blue-50'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">{insight.time}</Badge>
                      <Badge variant={
                        insight.type === 'warning' ? 'destructive' :
                        insight.type === 'success' ? 'default' : 'secondary'
                      }>
                        {insight.type}
                      </Badge>
                    </div>
                    <p className="text-gray-700">{insight.insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {badges.map((badge, index) => (
              <Card key={index} className={`${badge.earned ? 'ring-2 ring-green-200' : 'opacity-75'}`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full ${badge.color} flex items-center justify-center mx-auto mb-4 ${
                    badge.earned ? 'animate-pulse' : 'grayscale'
                  }`}>
                    <badge.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{badge.name}</h3>
                  <Badge variant={badge.earned ? "default" : "secondary"}>
                    {badge.earned ? "Earned!" : "Locked"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Chat Assistant Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Chat with AI Health Assistant</h2>
        {user && <AIChatAssistant userId={user.id} />}
      </div>
    </div>
  );
};

export default AIHealthCoach;
