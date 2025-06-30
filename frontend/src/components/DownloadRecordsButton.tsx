
import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const DownloadRecordsButton = () => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadAllRecords = async () => {
    setIsDownloading(true);
    
    try {
      // Simulate API call to generate PDF with all records
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock PDF download
      const element = document.createElement('a');
      const file = new Blob(['Mock PDF content for all medical records'], { type: 'application/pdf' });
      element.href = URL.createObjectURL(file);
      element.download = `medical-records-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "Download Complete",
        description: "All medical records have been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading your records. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={downloadAllRecords}
      disabled={isDownloading}
    >
      <Download className="w-4 h-4 mr-2" />
      {isDownloading ? "Downloading..." : "Download All Records"}
    </Button>
  );
};

export default DownloadRecordsButton;
