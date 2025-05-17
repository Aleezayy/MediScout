import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSyntheticData, regenerateSyntheticData, exportDataToCSV } from '@/lib/syntheticDataManager';
import { Users, AlertTriangle, Activity, Download, RefreshCw, BarChartBig, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon, description, color = "text-primary" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {React.cloneElement(icon, { className: `h-5 w-5 ${color}` })}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${color}`}>{value}</div>
        <p className="text-xs text-muted-foreground pt-1">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const DashboardPage = () => {
  const [data, setData] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    setData(getSyntheticData());
  }, []);

  const handleRegenerateData = () => {
    const newData = regenerateSyntheticData();
    setData(newData);
    toast({
      title: "Data Regenerated",
      description: "New synthetic community dataset has been generated.",
      variant: "default",
    });
  };

  const handleExportData = () => {
    exportDataToCSV(data);
    toast({
      title: "Data Exported",
      description: "Synthetic community dataset has been exported as CSV.",
      variant: "default",
    });
  };
  
  const totalPatients = data.length;
  const highRiskPatients = data.filter(p => p.simulatedRiskScore >= 7).length;
  const commonConditions = data.reduce((acc, p) => {
    acc[p.conditionAssigned] = (acc[p.conditionAssigned] || 0) + 1;
    return acc;
  }, {});
  const mostCommonCondition = Object.entries(commonConditions).sort((a,b) => b[1] - a[1])[0] || ["N/A", 0];


  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
              Community Health Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Overview of community health observations (synthetic data for health workers).
            </p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={handleRegenerateData} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
              <RefreshCw className="mr-2 h-4 w-4" /> Regenerate Data
            </Button>
            <Button onClick={handleExportData} className="bg-gradient-to-r from-accent to-primary/80 text-primary-foreground hover:opacity-90">
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Total Observations" 
          value={totalPatients} 
          icon={<Users />} 
          description="Total records in the community dataset."
        />
        <StatCard 
          title="High-Risk Cases" 
          value={highRiskPatients} 
          icon={<AlertTriangle />} 
          description="Records flagged with high risk scores (≥7)."
          color="text-destructive"
        />
        <StatCard 
          title="Most Common Condition" 
          value={mostCommonCondition[0]} 
          icon={<Activity />} 
          description={`Observed in ${mostCommonCondition[1]} cases.`}
          color="text-accent"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 ease-in-out bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Analytics & Exploration Tools</CardTitle>
            <CardDescription>Dive deeper into the community health data.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/admin/explore">
              <Button variant="outline" className="w-full py-6 text-lg border-primary/40 hover:bg-primary/10 hover:text-primary">
                <Users className="mr-3 h-6 w-6 text-primary" /> View Community Data
              </Button>
            </Link>
            <Link to="/admin/visualize">
              <Button variant="outline" className="w-full py-6 text-lg border-accent/40 hover:bg-accent/10 hover:text-accent">
                <BarChartBig className="mr-3 h-6 w-6 text-accent" /> See Visualizations
              </Button>
            </Link>
            <Link to="/admin/impact">
              <Button variant="outline" className="w-full py-6 text-lg border-secondary/40 hover:bg-secondary/10 hover:text-secondary">
                <MapPin className="mr-3 h-6 w-6 text-secondary" /> Analyze Impact & Map
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 p-6 bg-card/70 backdrop-blur-sm rounded-lg shadow-lg border border-border/50"
      >
        <h2 className="text-2xl font-semibold mb-4 text-primary">About This Dashboard</h2>
        <p className="text-muted-foreground mb-2">
          This dashboard provides an aggregated view of synthetic community health data for health workers and administrators.
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1">
          <li>Data is synthetically generated based on epidemiological assumptions for Pakistan.</li>
          <li>AI functionalities (diagnosis, risk scoring) are <strong className="text-secondary">simulated</strong> for demonstration.</li>
          <li>This section is intended for a high-level overview and trend analysis.</li>
        </ul>
         <p className="text-sm text-amber-500 dark:text-amber-400 mt-4">
          Note: This is a prototype. No real patient data is used, and AI models are not actually trained or deployed in this version. Patient-specific data is managed through individual patient logins.
        </p>
      </motion.div>

    </div>
  );
};

export default DashboardPage;