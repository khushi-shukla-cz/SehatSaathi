
import { useState, useRef } from "react";
import { Camera, Scan, AlertTriangle, CheckCircle, Clock, Upload, Eye, Zap, Brain } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const SymptomScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const videoRef = useRef(null);
  const { toast } = useToast();

  const scanResults = {
    rash: {
      severity: "Low",
      confidence: 85,
      diagnosis: "Contact Dermatitis",
      recommendation: "Monitor for 24-48 hours. Apply cool compress and avoid irritants.",
      urgency: "low",
      nextSteps: ["Apply topical antihistamine", "Avoid known allergens", "Schedule follow-up if worsening"]
    },
    swelling: {
      severity: "Medium",
      confidence: 92,
      diagnosis: "Localized Inflammation",
      recommendation: "Apply ice for 15-20 minutes every hour. Elevate if possible.",
      urgency: "medium",
      nextSteps: ["Apply cold therapy", "Take anti-inflammatory", "See doctor if no improvement in 48h"]
    },
    cut: {
      severity: "High",
      confidence: 78,
      diagnosis: "Deep Laceration",
      recommendation: "SEEK IMMEDIATE MEDICAL ATTENTION - This requires professional treatment.",
      urgency: "high",
      nextSteps: ["Clean wound gently", "Apply pressure to stop bleeding", "Go to emergency room NOW"]
    }
  };

  const recentScans = [
    { date: "Dec 23, 2024", type: "Skin Rash", result: "Low Risk", confidence: 85 },
    { date: "Dec 20, 2024", type: "Joint Swelling", result: "Medium Risk", confidence: 92 },
    { date: "Dec 18, 2024", type: "Bruise", result: "Low Risk", confidence: 88 }
  ];

  const handleStartCamera = async () => {
    try {
      setCameraActive(true);
      toast({
        title: "Camera Activated",
        description: "Position the affected area in the camera view",
      });
      
      // Simulate camera access
      setTimeout(() => {
        toast({
          title: "Camera Ready",
          description: "Tap 'Scan Symptom' when ready to analyze",
        });
      }, 1000);
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const handleScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate AI analysis process
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScanComplete(true);
          // Simulate random result
          const resultTypes = Object.keys(scanResults);
          const randomResult = resultTypes[Math.floor(Math.random() * resultTypes.length)];
          setScanResult(scanResults[randomResult]);
          
          toast({
            title: "Scan Complete!",
            description: "AI analysis finished. Review your results below.",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleEmergencyAlert = () => {
    toast({
      title: "🚨 EMERGENCY ALERT",
      description: "Contacting emergency services and your emergency contacts.",
      variant: "destructive",
    });
  };

  const handleUploadImage = () => {
    toast({
      title: "Image Upload",
      description: "Select an image from your gallery to analyze",
    });
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-orange-500 bg-orange-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium': return <Clock className="w-5 h-5 text-orange-500" />;
      case 'low': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Eye className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Scan className="w-8 h-8 mr-3 text-green-600" />
            Symptom Scanner
          </h1>
          <p className="text-gray-600 mt-1">AI-Powered Instant Health Analysis</p>
        </div>
        <Button 
          onClick={handleEmergencyAlert}
          variant="destructive"
          className="animate-pulse"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Emergency Alert
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Camera/Scanner Interface */}
        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="w-5 h-5 mr-2 text-blue-600" />
              Live Scanner
            </CardTitle>
            <CardDescription>Position symptom area in camera view for analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Camera View */}
              <div className="relative w-full h-80 bg-gray-900 rounded-lg overflow-hidden">
                {!cameraActive ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-4">Camera Not Active</p>
                      <Button onClick={handleStartCamera} variant="secondary">
                        <Camera className="w-4 h-4 mr-2" />
                        Start Camera
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900">
                    {/* Simulated camera feed */}
                    <div className="absolute inset-0 opacity-30">
                      <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500"></div>
                    </div>
                    
                    {/* Scanning overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        {/* Scanning frame */}
                        <div className="w-48 h-48 border-2 border-green-400 rounded-lg relative">
                          {isScanning && (
                            <div className="absolute inset-0">
                              <div className="w-full h-1 bg-green-400 absolute top-0 animate-pulse"></div>
                              <div className="w-1 h-full bg-green-400 absolute right-0 animate-pulse"></div>
                              <div className="w-full h-1 bg-green-400 absolute bottom-0 animate-pulse"></div>
                              <div className="w-1 h-full bg-green-400 absolute left-0 animate-pulse"></div>
                            </div>
                          )}
                          
                          {/* Corner markers */}
                          <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-green-400"></div>
                          <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-green-400"></div>
                          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-green-400"></div>
                          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-green-400"></div>
                        </div>
                        
                        {/* Instructions */}
                        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center text-white">
                          <p className="text-sm">Position symptom within frame</p>
                        </div>
                      </div>
                    </div>

                    {/* AI Status */}
                    <div className="absolute top-4 left-4 bg-black bg-opacity-50 rounded-lg p-2 text-white">
                      <div className="flex items-center space-x-2">
                        <Brain className="w-4 h-4 text-green-400" />
                        <span className="text-sm">AI Analysis Ready</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Scanning Progress */}
              {isScanning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Analyzing...</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <Progress value={scanProgress} className="h-2" />
                  <p className="text-xs text-center text-gray-500">
                    AI is analyzing the visual data and comparing with medical databases
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button 
                  onClick={handleScan}
                  disabled={!cameraActive || isScanning}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  {isScanning ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4 mr-2" />
                      Scan Symptom
                    </>
                  )}
                </Button>
                <Button onClick={handleUploadImage} variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scan Results */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>AI-powered symptom assessment</CardDescription>
          </CardHeader>
          <CardContent>
            {!scanComplete ? (
              <div className="text-center py-8 text-gray-500">
                <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Complete a scan to view results</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`border-2 rounded-lg p-4 ${getUrgencyColor(scanResult?.urgency)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getUrgencyIcon(scanResult?.urgency)}
                      <span className="font-semibold">{scanResult?.diagnosis}</span>
                    </div>
                    <Badge variant={
                      scanResult?.urgency === 'high' ? 'destructive' :
                      scanResult?.urgency === 'medium' ? 'secondary' : 'default'
                    }>
                      {scanResult?.severity} Risk
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>AI Confidence</span>
                      <span>{scanResult?.confidence}%</span>
                    </div>
                    <Progress value={scanResult?.confidence} className="h-2" />
                  </div>

                  <p className="text-sm mb-4">{scanResult?.recommendation}</p>

                  {scanResult?.urgency === 'high' && (
                    <Alert className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Immediate Action Required</AlertTitle>
                      <AlertDescription>
                        This condition may require urgent medical attention. Please contact a healthcare provider immediately.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div>
                    <p className="font-medium text-sm mb-2">Recommended Next Steps:</p>
                    <ul className="text-sm space-y-1">
                      {scanResult?.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-gray-400 mr-2">•</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    Save Results
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Share with Doctor
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Scans */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
            <CardDescription>Your scanning history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentScans.map((scan, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{scan.type}</p>
                    <p className="text-xs text-gray-500">{scan.date}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      scan.result === 'High Risk' ? 'destructive' :
                      scan.result === 'Medium Risk' ? 'secondary' : 'default'
                    }>
                      {scan.result}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{scan.confidence}% confidence</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SymptomScanner;
