import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Calendar, FileText, User, Activity, Heart, Home, LogOut, Video, Pill, MessageSquare, TrendingUp, Brain, UserCheck, Scan, Clock, BookOpen, Check, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Activity },
    { name: 'Appointments', href: '/appointments', icon: Calendar },
    { name: 'Telemedicine', href: '/telemedicine', icon: Video },
    { name: 'Medical Records', href: '/records', icon: FileText },
    { name: 'Medications', href: '/medications', icon: Pill },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Health Tracking', href: '/health-tracking', icon: TrendingUp },
    { name: 'Symptom Journal', href: '/symptom-journal', icon: BookOpen },
    { name: 'AI Health Coach', href: '/ai-coach', icon: Brain },
    { name: 'Health Avatar', href: '/health-avatar', icon: UserCheck },
    { name: 'Symptom Scanner', href: '/symptom-scanner', icon: Scan },
    { name: 'Mindful Minutes', href: '/mindful-minutes', icon: Clock },
    { name: 'Habits Tracker', href: '/habits-tracker', icon: Check },
{ name: 'First Aid Game', href: '/first-aid-game', icon: HeartPulse },
    
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold">
                SehatSaathi
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.user_metadata?.first_name || user?.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-blue-600"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <nav className="lg:w-64 space-y-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                Patient Portal
              </h2>
              <div className="space-y-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Button
                      key={item.name}
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start text-left",
                        isActive 
                          ? "bg-gradient-to-r from-blue-600 to-green-600 text-white" 
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      )}
                      onClick={() => navigate(item.href)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
