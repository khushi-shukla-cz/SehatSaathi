
import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, Save, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1985-06-15",
    address: "123 Main St, Anytown, ST 12345",
    emergencyContact: "Jane Doe - (555) 987-6543",
    insurance: "Blue Cross Blue Shield",
    policyNumber: "BC12345678"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    console.log("Saving profile data:", formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
  };

  const medicalInfo = {
    bloodType: "O+",
    allergies: ["Penicillin", "Shellfish"],
    conditions: ["Hypertension", "Type 2 Diabetes"],
    medications: ["Lisinopril 10mg", "Metformin 500mg"],
    lastCheckup: "Dec 15, 2024"
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal and medical information</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button onClick={handleCancel} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-600 to-green-600 text-white">
                {formData.firstName[0]}{formData.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">
              {formData.firstName} {formData.lastName}
            </CardTitle>
            <CardDescription>Patient ID: PT-123456</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{formData.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{formData.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Born {formData.dateOfBirth}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{formData.address}</span>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Your basic demographic and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900 py-2">{formData.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900 py-2">{formData.lastName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900 py-2">{formData.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900 py-2">{formData.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                {isEditing ? (
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900 py-2">{formData.dateOfBirth}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                {isEditing ? (
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900 py-2">{formData.address}</p>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                {isEditing ? (
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900 py-2">{formData.emergencyContact}</p>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-600" />
                Insurance Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="insurance">Insurance Provider</Label>
                  {isEditing ? (
                    <Input
                      id="insurance"
                      value={formData.insurance}
                      onChange={(e) => handleInputChange("insurance", e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{formData.insurance}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="policyNumber">Policy Number</Label>
                  {isEditing ? (
                    <Input
                      id="policyNumber"
                      value={formData.policyNumber}
                      onChange={(e) => handleInputChange("policyNumber", e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{formData.policyNumber}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-red-600" />
              Medical Information
            </CardTitle>
            <CardDescription>
              Important medical details for healthcare providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Blood Type</h4>
                <Badge variant="outline" className="text-red-600 border-red-200">
                  {medicalInfo.bloodType}
                </Badge>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Allergies</h4>
                <div className="space-y-1">
                  {medicalInfo.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="mr-2">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Current Conditions</h4>
                <div className="space-y-1">
                  {medicalInfo.conditions.map((condition, index) => (
                    <Badge key={index} variant="secondary" className="mr-2 mb-1">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Current Medications</h4>
                <div className="space-y-1">
                  {medicalInfo.medications.map((medication, index) => (
                    <Badge key={index} variant="outline" className="mr-2 mb-1">
                      {medication}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Last Checkup</h4>
                <p className="text-gray-600">{medicalInfo.lastCheckup}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
