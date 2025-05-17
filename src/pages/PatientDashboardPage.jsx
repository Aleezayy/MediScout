import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ClipboardX as ClipboardPlus, UserCircle, CalendarDays, MapPin as MapPinIcon, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const PatientDashboardPage = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <p>Loading patient data...</p>;
  }
  
  const getRiskBadgeVariant = (score) => {
    if (!score) return 'default';
    if (score >= 7) return 'destructive';
    if (score >= 4) return 'warning';
    return 'success';
  };
  
  const getRiskLabel = (score) => {
    if (!score) return 'N/A';
    if (score >= 7) return 'High';
    if (score >= 4) return 'Medium';
    return 'Low';
  };


  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">Welcome, {currentUser.name}!</h1>
          <p className="text-muted-foreground mt-1">Manage your health information and submit new entries.</p>
        </div>
        <Link to="/patient/new-entry">
          <Button size="lg" className="mt-4 md:mt-0 text-base py-3 px-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
            <ClipboardPlus className="mr-2 h-5 w-5" /> New Health Entry
          </Button>
        </Link>
      </div>

      <Card className="shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
          <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-md">
            <UserCircle className="h-6 w-6 text-primary" />
            <span><strong>Username:</strong> {currentUser.username}</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-md">
            <Activity className="h-6 w-6 text-primary" />
            <span><strong>Age:</strong> {currentUser.age}</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-md">
            <UserCircle className="h-6 w-6 text-primary" /> {/* Placeholder, consider specific icon for gender */}
            <span><strong>Gender:</strong> {currentUser.gender}</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-md">
            <MapPinIcon className="h-6 w-6 text-primary" />
            <span><strong>Location:</strong> {currentUser.location}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-accent/20">
        <CardHeader>
          <CardTitle className="text-2xl">Health Record History</CardTitle>
          <CardDescription>
            {currentUser.healthRecords && currentUser.healthRecords.length > 0 
              ? "Your past health submissions and AI-generated advice." 
              : "You have no health records yet. Submit a new health entry to get started."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentUser.healthRecords && currentUser.healthRecords.length > 0 ? (
            currentUser.healthRecords.slice().reverse().map((record, index) => ( // Show newest first
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="bg-card/50 border-muted-foreground/20">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-primary/90">Record: {new Date(record.date).toLocaleDateString()}</CardTitle>
                        <CardDescription className="text-xs">Submitted on {new Date(record.date).toLocaleTimeString()}</CardDescription>
                      </div>
                      <Badge variant={getRiskBadgeVariant(record.aiPrediction?.riskScore)} className="text-sm">
                         Risk: {getRiskLabel(record.aiPrediction?.riskScore)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p><strong className="text-muted-foreground">Symptoms Reported:</strong> {record.symptoms}</p>
                    <div>
                        <strong className="text-muted-foreground">Vitals:</strong>
                        <ul className="list-disc list-inside ml-4 text-sm">
                            <li>Temperature: {record.vitals?.temperature || 'N/A'} °C</li>
                            <li>Weight: {record.vitals?.weight || 'N/A'} kg</li>
                        </ul>
                    </div>
                    {record.imageFile && <p><strong className="text-muted-foreground">Image Submitted:</strong> {record.imageFile.name}</p>}
                    
                    <div className="p-3 bg-muted/20 rounded-md mt-2 border border-dashed border-accent/50">
                        <p className="font-semibold text-accent">AI Predicted Condition: {record.aiPrediction?.prediction || "Not available"}</p>
                        <p className="text-sm"><strong className="text-muted-foreground">AI Advice:</strong> {record.aiPrediction?.advice || "Not available"}</p>
                        {record.aiPrediction?.imageAnalysis && <p className="text-sm mt-1"><strong className="text-muted-foreground">AI Image Note:</strong> {record.aiPrediction.imageAnalysis}</p>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <CalendarDays className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No health records found.</p>
              <p className="text-sm text-muted-foreground/80">Click "New Health Entry" to add your first record.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PatientDashboardPage;