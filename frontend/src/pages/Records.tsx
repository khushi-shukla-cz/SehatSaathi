import { useState } from "react";
import { FileText, Download, Eye, Search, Filter, Calendar, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DownloadRecordsButton from "@/components/DownloadRecordsButton";

const Records = () => {
  const labResults = [
    {
      id: 1,
      test: "Complete Blood Count (CBC)",
      date: "Dec 15, 2024",
      doctor: "Dr. Sarah Johnson",
      status: "Normal",
      category: "Blood Work",
      results: {
        "White Blood Cells": "7.2 K/uL (Normal: 4.0-10.0)",
        "Red Blood Cells": "4.5 M/uL (Normal: 4.2-5.4)",
        "Hemoglobin": "14.2 g/dL (Normal: 12.0-16.0)",
        "Platelets": "280 K/uL (Normal: 150-450)"
      }
    },
    {
      id: 2,
      test: "Lipid Panel",
      date: "Dec 10, 2024",
      doctor: "Dr. Michael Chen",
      status: "Attention Needed",
      category: "Blood Work",
      results: {
        "Total Cholesterol": "195 mg/dL (Normal: <200)",
        "LDL Cholesterol": "125 mg/dL (Normal: <100)",
        "HDL Cholesterol": "55 mg/dL (Normal: >40)",
        "Triglycerides": "140 mg/dL (Normal: <150)"
      }
    },
    {
      id: 3,
      test: "Chest X-Ray",
      date: "Dec 5, 2024",
      doctor: "Dr. Emily Rodriguez",
      status: "Normal",
      category: "Imaging",
      results: {
        "Heart": "Normal size and contour",
        "Lungs": "Clear bilateral lung fields",
        "Bones": "No acute abnormalities",
        "Impression": "Normal chest radiograph"
      }
    }
  ];

  const medications = [
    {
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      prescribedBy: "Dr. Sarah Johnson",
      dateStarted: "Nov 15, 2024",
      indication: "Blood pressure control",
      status: "Active"
    },
    {
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      prescribedBy: "Dr. Michael Chen",
      dateStarted: "Oct 20, 2024",
      indication: "Type 2 diabetes management",
      status: "Active"
    },
    {
      name: "Vitamin D3",
      dosage: "2000 IU",
      frequency: "Once daily",
      prescribedBy: "Dr. Michael Chen",
      dateStarted: "Sep 10, 2024",
      indication: "Vitamin D deficiency",
      status: "Active"
    }
  ];

  const vaccinations = [
    {
      vaccine: "COVID-19 Booster",
      date: "Oct 15, 2024",
      provider: "SehatSaathi Clinic",
      lotNumber: "ABC123",
      nextDue: "Oct 15, 2025"
    },
    {
      vaccine: "Influenza",
      date: "Sep 20, 2024",
      provider: "SehatSaathi Clinic",
      lotNumber: "FLU456",
      nextDue: "Sep 20, 2025"
    },
    {
      vaccine: "Tdap",
      date: "Jan 12, 2022",
      provider: "Community Health Center",
      lotNumber: "TD789",
      nextDue: "Jan 12, 2032"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "normal":
        return "bg-green-100 text-green-800";
      case "attention needed":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-red-100 text-red-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-gray-600 mt-1">Your complete health information</p>
        </div>
        <DownloadRecordsButton />
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search records..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-[200px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Records</SelectItem>
            <SelectItem value="lab">Lab Results</SelectItem>
            <SelectItem value="imaging">Imaging</SelectItem>
            <SelectItem value="medications">Medications</SelectItem>
            <SelectItem value="vaccinations">Vaccinations</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="lab-results" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-fit lg:grid-cols-3">
          <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
        </TabsList>

        <TabsContent value="lab-results" className="space-y-4">
          {labResults.map((result) => (
            <Card key={result.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-lg">{result.test}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {result.date}
                      </span>
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {result.doctor}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(result.status)}>
                      {result.status}
                    </Badge>
                    <Badge variant="outline">{result.category}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {Object.entries(result.results).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="medications" className="space-y-4">
          {medications.map((medication, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {medication.name}
                      </h3>
                      <Badge className={getStatusColor(medication.status)}>
                        {medication.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Dosage:</span>
                        <p className="text-gray-900">{medication.dosage}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Frequency:</span>
                        <p className="text-gray-900">{medication.frequency}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Prescribed by:</span>
                        <p className="text-gray-900">{medication.prescribedBy}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Date Started:</span>
                        <p className="text-gray-900">{medication.dateStarted}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="font-medium text-gray-700">Indication:</span>
                        <p className="text-gray-900">{medication.indication}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Refill Request
                    </Button>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="vaccinations" className="space-y-4">
          {vaccinations.map((vaccination, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {vaccination.vaccine}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Date Given:</span>
                        <p className="text-gray-900">{vaccination.date}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Provider:</span>
                        <p className="text-gray-900">{vaccination.provider}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Lot Number:</span>
                        <p className="text-gray-900">{vaccination.lotNumber}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Next Due:</span>
                        <p className="text-gray-900">{vaccination.nextDue}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download Record
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Records;
