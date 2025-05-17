import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getSyntheticData } from '@/lib/syntheticDataManager';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const BarChart = ({ data, title, dataKey, labelKey, barColorClass = "bg-primary", description }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="h-full bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data available for this chart.</p>
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map(item => item[dataKey]));

  return (
    <Card className="h-full bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">{item[labelKey]}</span>
              <span className="font-semibold text-foreground">{item[dataKey]}</span>
            </div>
            <Progress value={(item[dataKey] / maxValue) * 100} className={`h-3 ${barColorClass}`} indicatorClassName={barColorClass} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};


const VisualizationsPage = () => {
  const [syntheticData, setSyntheticData] = useState([]);

  useEffect(() => {
    setSyntheticData(getSyntheticData());
  }, []);

  const conditionDistribution = useMemo(() => {
    if (!syntheticData.length) return [];
    const counts = syntheticData.reduce((acc, patient) => {
      acc[patient.conditionAssigned] = (acc[patient.conditionAssigned] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .map(([condition, count]) => ({ condition, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); 
  }, [syntheticData]);

  const riskScoreDistribution = useMemo(() => {
    if (!syntheticData.length) return [];
    const counts = syntheticData.reduce((acc, patient) => {
      const score = patient.simulatedRiskScore;
      let category;
      if (score >= 7) category = 'High Risk (7-10)';
      else if (score >= 4) category = 'Medium Risk (4-6)';
      else category = 'Low Risk (1-3)';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .map(([riskCategory, count]) => ({ riskCategory, count }))
      .sort((a,b) => { 
          if (a.riskCategory.startsWith('Low')) return -1;
          if (b.riskCategory.startsWith('Low')) return 1;
          if (a.riskCategory.startsWith('Medium')) return -1;
          if (b.riskCategory.startsWith('Medium')) return 1;
          return 0;
      });
  }, [syntheticData]);

  const ageDistribution = useMemo(() => {
    if (!syntheticData.length) return [];
    const ageGroups = {
      '0-5 yrs': 0,
      '6-17 yrs': 0,
      '18-40 yrs': 0,
      '41-65 yrs': 0,
      '65+ yrs': 0,
    };
    syntheticData.forEach(patient => {
      const age = patient.age;
      if (age <= 5) ageGroups['0-5 yrs']++;
      else if (age <= 17) ageGroups['6-17 yrs']++;
      else if (age <= 40) ageGroups['18-40 yrs']++;
      else if (age <= 65) ageGroups['41-65 yrs']++;
      else ageGroups['65+ yrs']++;
    });
    return Object.entries(ageGroups).map(([ageGroup, count]) => ({ ageGroup, count }));
  }, [syntheticData]);
  
  const genderDistribution = useMemo(() => {
    if (!syntheticData.length) return [];
    const counts = syntheticData.reduce((acc, patient) => {
      acc[patient.gender] = (acc[patient.gender] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .map(([gender, count]) => ({ gender, count }))
      .sort((a, b) => b.count - a.count);
  }, [syntheticData]);


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">Community Data Visualizations</h1>
        <p className="text-muted-foreground">Visual overview of the synthetic community health dataset.</p>
      </div>

      <Tabs defaultValue="conditions" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4 bg-card/70 backdrop-blur-sm p-1.5 rounded-lg">
          <TabsTrigger value="conditions" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Conditions</TabsTrigger>
          <TabsTrigger value="risk" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Risk Scores</TabsTrigger>
          <TabsTrigger value="age" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Age Groups</TabsTrigger>
          <TabsTrigger value="gender" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Gender</TabsTrigger>
        </TabsList>
        
        <TabsContent value="conditions">
          <motion.div initial={{ opacity: 0, y:10 }} animate={{ opacity:1, y:0 }} transition={{delay:0.1}}>
            <BarChart data={conditionDistribution} title="Top 10 Condition Distribution" dataKey="count" labelKey="condition" barColorClass="bg-gradient-to-r from-primary to-accent" description="Most frequently assigned conditions in the dataset." />
          </motion.div>
        </TabsContent>
        <TabsContent value="risk">
          <motion.div initial={{ opacity: 0, y:10 }} animate={{ opacity:1, y:0 }} transition={{delay:0.1}}>
            <BarChart data={riskScoreDistribution} title="Risk Score Distribution" dataKey="count" labelKey="riskCategory" barColorClass="bg-gradient-to-r from-destructive to-secondary" description="Distribution of simulated risk scores across records." />
          </motion.div>
        </TabsContent>
        <TabsContent value="age">
          <motion.div initial={{ opacity: 0, y:10 }} animate={{ opacity:1, y:0 }} transition={{delay:0.1}}>
            <BarChart data={ageDistribution} title="Age Group Distribution" dataKey="count" labelKey="ageGroup" barColorClass="bg-gradient-to-r from-accent to-secondary" description="Breakdown of records by age categories."/>
          </motion.div>
        </TabsContent>
        <TabsContent value="gender">
          <motion.div initial={{ opacity: 0, y:10 }} animate={{ opacity:1, y:0 }} transition={{delay:0.1}}>
            <BarChart data={genderDistribution} title="Gender Distribution" dataKey="count" labelKey="gender" barColorClass="bg-gradient-to-r from-primary to-secondary" description="Gender representation in the dataset."/>
          </motion.div>
        </TabsContent>
      </Tabs>
      
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Chart Interpretation Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
            <li>All charts are based on the <strong className="text-primary">synthetic community dataset</strong> generated by the application.</li>
            <li>The data aims to reflect the epidemiological assumptions provided but is still a simulation.</li>
            <li>These visualizations help in understanding the overall composition of the simulated community population.</li>
          </ul>
        </CardContent>
      </Card>

    </motion.div>
  );
};

export default VisualizationsPage;