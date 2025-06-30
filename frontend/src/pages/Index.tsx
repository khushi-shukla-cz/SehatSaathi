import { useState, useEffect } from "react";
import { Calendar, FileText, User, Activity, Heart, Shield, Clock, Users, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showLearnMore, setShowLearnMore] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const features = [
    {
      icon: Calendar,
      title: "Easy Scheduling",
      description: "Book appointments with your healthcare providers in just a few clicks",
      route: "/appointments",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop&crop=center"
    },
    {
      icon: FileText,
      title: "Medical Records",
      description: "Access your complete medical history, test results, and prescriptions",
      route: "/records",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&crop=center"
    },
    {
      icon: Activity,
      title: "Health Tracking",
      description: "Monitor your vital signs, medications, and health metrics",
      route: "/health-tracking",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop&crop=center"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your health data is protected with enterprise-grade security",
      route: "/profile",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop&crop=center"
    }
  ];

  const stats = [
    { number: "50K+", label: "Patients Served" },
    { number: "200+", label: "Healthcare Providers" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support Available" }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50 animate-fade-in">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center animate-pulse">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              SehatSaathi
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => scrollToSection('features')} 
              className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-110"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-110"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-110"
            >
              Contact
            </button>
          </nav>
          <Button 
            onClick={() => navigate('/auth')} 
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Patient Portal
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 animate-fade-in">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&h=400&fit=crop&crop=center" 
              alt="Healthcare professional using technology"
              className="rounded-2xl shadow-2xl animate-scale-in hover:scale-105 transition-transform duration-500"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in">
            Your Health,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent animate-pulse">
              Simplified
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed animate-fade-in">
            Access your medical records, schedule appointments, and manage your healthcare 
            journey all in one secure, easy-to-use platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <Button 
              onClick={() => navigate('/auth')}
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-8 py-3 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-pulse"
            >
              Access Portal
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setShowLearnMore(!showLearnMore)}
              className="border-blue-200 text-blue-600 hover:bg-blue-50 text-lg px-8 py-3 transform hover:scale-105 transition-all duration-300"
            >
              Learn More
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-300 ${showLearnMore ? 'rotate-180' : ''}`} />
            </Button>
          </div>
          
          {/* Learn More Content */}
          {showLearnMore && (
            <div className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-100 text-left animate-scale-in">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose SehatSaathi?</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="transform hover:scale-105 transition-all duration-300">
                  <h4 className="font-semibold text-blue-600 mb-2">🏥 Comprehensive Care</h4>
                  <p className="text-gray-600">Access all your healthcare needs in one platform - from scheduling to telemedicine consultations.</p>
                </div>
                <div className="transform hover:scale-105 transition-all duration-300">
                  <h4 className="font-semibold text-blue-600 mb-2">🤖 AI-Powered Health</h4>
                  <p className="text-gray-600">Get personalized health insights with our AI health coach and smart symptom scanner.</p>
                </div>
                <div className="transform hover:scale-105 transition-all duration-300">
                  <h4 className="font-semibold text-blue-600 mb-2">📱 Always Accessible</h4>
                  <p className="text-gray-600">Your health data is available 24/7, wherever you are, on any device.</p>
                </div>
                <div className="transform hover:scale-105 transition-all duration-300">
                  <h4 className="font-semibold text-blue-600 mb-2">🔒 Bank-Level Security</h4>
                  <p className="text-gray-600">Your sensitive health information is protected with enterprise-grade encryption.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white/50 backdrop-blur-sm py-16 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center transform hover:scale-110 transition-all duration-300 animate-fade-in">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2 animate-pulse">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Better Healthcare
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our comprehensive platform puts you in control of your health journey
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-blue-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer group animate-fade-in overflow-hidden"
              onClick={() => navigate('/auth')}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-green-100 rounded-xl flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900 transform group-hover:text-blue-600 transition-colors duration-300">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 leading-relaxed mb-4">
                  {feature.description}
                </CardDescription>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/auth');
                  }}
                >
                  Access Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white/50 backdrop-blur-sm py-20 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 animate-fade-in">About SehatSaathi</h2>
            <div className="mb-8">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop&crop=center" 
                alt="Healthcare technology"
                className="rounded-2xl shadow-xl mx-auto animate-scale-in hover:scale-105 transition-transform duration-500"
              />
            </div>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed animate-fade-in">
              SehatSaathi is revolutionizing healthcare by putting patients at the center of their health journey. 
              Our platform combines cutting-edge technology with compassionate care to make healthcare more accessible, 
              efficient, and personalized than ever before.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center transform hover:scale-105 transition-all duration-300 animate-fade-in">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Heart className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                <p className="text-gray-600">To make quality healthcare accessible to everyone, everywhere, through innovative technology and personalized care.</p>
              </div>
              
              <div className="text-center transform hover:scale-105 transition-all duration-300 animate-fade-in">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Our Team</h3>
                <p className="text-gray-600">A dedicated team of healthcare professionals, engineers, and designers working together to improve patient outcomes.</p>
              </div>
              
              <div className="text-center transform hover:scale-105 transition-all duration-300 animate-fade-in">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Our Promise</h3>
                <p className="text-gray-600">Your health data is secure, your privacy is protected, and your care is our top priority.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 py-20 animate-fade-in relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-repeat" style={{backgroundImage: "url('data:image/svg+xml;utf8,<svg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" fill-rule=\"evenodd\"><g fill=\"%23ffffff\" fill-opacity=\"0.1\"><circle cx=\"30\" cy=\"30\" r=\"4\"/></g></g></svg>')"}}></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6 animate-fade-in">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto animate-fade-in">
            Join thousands of patients who trust our platform for their healthcare needs
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            size="lg" 
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3 transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl animate-fade-in"
          >
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gray-900 text-white py-20 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
            <p className="text-xl text-gray-300">We are here to help with any questions or concerns</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="animate-fade-in">
              <h3 className="text-2xl font-semibold mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 transform hover:scale-105 transition-transform duration-300">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span>Available 24/7 for urgent matters</span>
                </div>
                <div className="flex items-center space-x-3 transform hover:scale-105 transition-transform duration-300">
                  <Heart className="w-5 h-5 text-blue-400 animate-pulse" />
                  <span>Dedicated patient support team</span>
                </div>
                <div className="flex items-center space-x-3 transform hover:scale-105 transition-transform duration-300">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span>Secure and confidential communication</span>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4">Emergency Support</h4>
                <p className="text-gray-300 mb-2">For medical emergencies, please call 911 immediately.</p>
                <p className="text-gray-300">For urgent health questions: <span className="text-blue-400 font-semibold hover:text-blue-300 transition-colors duration-300">1-800-HEALTH</span></p>
              </div>
            </div>
            
            <div className="animate-fade-in">
              <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <h4 className="font-semibold text-blue-400 mb-2">General Support</h4>
                  <p>Email: support@sehatsaathi.com</p>
                  <p>Phone: 1-800-HEALTH (1-800-432-584)</p>
                </div>
                
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <h4 className="font-semibold text-blue-400 mb-2">Technical Support</h4>
                  <p>Email: tech@sehatsaathi.com</p>
                  <p>Available: Monday - Friday, 8 AM - 8 PM EST</p>
                </div>
                
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <h4 className="font-semibold text-blue-400 mb-2">Business Inquiries</h4>
                  <p>Email: business@sehatsaathi.com</p>
                  <p>Phone: 1-800-BIZ-HEALTH</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 text-white py-12 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl font-bold">SehatSaathi</span>
              </div>
              <p className="text-gray-400">
                Empowering patients with secure, accessible healthcare management.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => navigate('/auth')} className="hover:text-white transition-colors">Appointment Scheduling</button></li>
                <li><button onClick={() => navigate('/auth')} className="hover:text-white transition-colors">Medical Records</button></li>
                <li><button onClick={() => navigate('/auth')} className="hover:text-white transition-colors">Health Tracking</button></li>
                <li><button onClick={() => navigate('/auth')} className="hover:text-white transition-colors">Prescription Management</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Help Center</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Contact Us</button></li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>1-800-HEALTH</li>
                <li>support@sehatsaathi.com</li>
                <li>Available 24/7</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SehatSaathi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
