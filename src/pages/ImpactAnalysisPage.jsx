import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getSyntheticData } from '@/lib/syntheticDataManager';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, MapPin, CheckCircle2, Users } from 'lucide-react';

const ImpactStatCard = ({ title, value, icon, description, detail, color = "text-primary" }) => (
  <Card className="hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 bg-card/80 backdrop-blur-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      {React.cloneElement(icon, { className: `h-5 w-5 ${color}` })}
    </CardHeader>
    <CardContent>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <p className="text-xs text-muted-foreground pt-1">{description}</p>
      {detail && <p className="text-xs text-muted-foreground/70 pt-1">{detail}</p>}
    </CardContent>
  </Card>
);

const ImpactAnalysisPage = () => {
  const [syntheticData, setSyntheticData] = useState([]);

  useEffect(() => {
    setSyntheticData(getSyntheticData());
  }, []);

  const impactMetrics = useMemo(() => {
    if (!syntheticData.length) return {
      totalHighRisk: 0,
      aiIdentifiedHighRisk: 0,
      identificationRate: 0,
      avgTimeToIdentifyBaseline: 72, 
      avgTimeToIdentifyAI: 6, 
      timeSavedPerCase: 0,
    };

    const highRiskPatients = syntheticData.filter(p => p.simulatedRiskScore >= 7);
    const totalHighRisk = highRiskPatients.length;
    
    const aiIdentifiedHighRisk = Math.round(totalHighRisk * 0.9); 
    const identificationRate = totalHighRisk > 0 ? (aiIdentifiedHighRisk / totalHighRisk) * 100 : 0;

    const avgTimeToIdentifyBaseline = 72; 
    const avgTimeToIdentifyAI = 6; 
    const timeSavedPerCase = avgTimeToIdentifyBaseline - avgTimeToIdentifyAI;

    return {
      totalHighRisk,
      aiIdentifiedHighRisk,
      identificationRate: parseFloat(identificationRate.toFixed(1)),
      avgTimeToIdentifyBaseline,
      avgTimeToIdentifyAI,
      timeSavedPerCase,
    };
  }, [syntheticData]);

  const locationDistribution = useMemo(() => {
    if (!syntheticData.length) return [];
    const counts = syntheticData.reduce((acc, patient) => {
      acc[patient.location] = (acc[patient.location] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .map(([location, count]) => ({ location, count, highRisk: syntheticData.filter(p => p.location === location && p.simulatedRiskScore >=7).length }))
      .sort((a, b) => b.count - a.count);
  }, [syntheticData]);

  const mapCenter = useMemo(() => {
    const defaultCoords = { lat: 30.3753, lon: 69.3451, zoom: 5 }; 
    if (locationDistribution.length > 0) {
      const firstLocation = locationDistribution[0].location;
      const cityCoords = {
        'Karachi': { lat: 24.8607, lon: 67.0011, zoom: 10 },
        'Lahore': { lat: 31.5820, lon: 74.3294, zoom: 10 },
        'Islamabad': { lat: 33.6844, lon: 73.0479, zoom: 10 },
        'Peshawar': { lat: 34.0151, lon: 71.5249, zoom: 10 },
        'Quetta': { lat: 30.1798, lon: 66.9750, zoom: 10 },
      };
      return cityCoords[firstLocation] || defaultCoords;
    }
    return defaultCoords;
  }, [locationDistribution]);
  
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter.lon-0.5},${mapCenter.lat-0.5},${mapCenter.lon+0.5},${mapCenter.lat+0.5}&layer=mapnik&marker=${mapCenter.lat},${mapCenter.lon}`;


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">Impact Analysis & Geographic Overview</h1>
        <p className="text-muted-foreground">Simulated impact of AI assistance and geographic distribution of community cases.</p>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Simulated AI Impact Metrics (Community Data)</CardTitle>
          <CardDescription>Comparison of AI-assisted scenario vs. baseline (simulated).</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ImpactStatCard 
            title="Total High-Risk Cases" 
            value={impactMetrics.totalHighRisk} 
            icon={<AlertTriangle />} 
            description="Records with risk score ≥7."
            color="text-destructive"
          />
          <ImpactStatCard 
            title="AI Identified High-Risk" 
            value={`${impactMetrics.aiIdentifiedHighRisk} (${impactMetrics.identificationRate}%)`}
            icon={<CheckCircle2 />} 
            description="High-risk records caught by simulated AI."
            detail="Based on 90% assumed AI accuracy on high-risk."
            color="text-green-400"
          />
          <ImpactStatCard 
            title="Time Saved Per Case" 
            value={`${impactMetrics.timeSavedPerCase} hrs`}
            icon={<Users />} 
            description="Avg. time saved in diagnosis/referral with AI."
            detail={`Baseline: ${impactMetrics.avgTimeToIdentifyBaseline}h, AI: ${impactMetrics.avgTimeToIdentifyAI}h`}
            color="text-accent"
          />
        </CardContent>
         <CardContent>
            <p className="text-sm text-amber-500 dark:text-amber-400 mt-2">
              Note: These impact metrics are based on <strong className="text-secondary">simulations and assumptions</strong> for demonstration purposes.
              Actual impact would require real-world data and AI model validation.
            </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">Geographic Distribution (Top Locations)</CardTitle>
            <CardDescription>Simulated case counts by location from community data.</CardDescription>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto custom-scrollbar">
            {locationDistribution.length > 0 ? (
              <ul className="space-y-3">
                {locationDistribution.map(item => (
                  <li key={item.location} className="flex justify-between items-center p-3 bg-muted/20 rounded-md hover:bg-muted/40 transition-colors">
                    <div>
                      <span className="font-medium text-foreground">{item.location}</span>
                      <p className="text-xs text-muted-foreground">Total Cases: {item.count}</p>
                    </div>
                    <div className="text-right">
                       <span className={`font-semibold ${item.highRisk > 0 ? 'text-destructive' : 'text-green-400'}`}>
                         {item.highRisk} High-Risk
                       </span>
                       <p className="text-xs text-muted-foreground">
                         ({item.highRisk > 0 && item.count > 0 ? ((item.highRisk/item.count)*100).toFixed(1) : 0}%)
                       </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No location data available.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">Map Overview (OpenStreetMap)</CardTitle>
            <CardDescription>Illustrative map centered on a key area from synthetic community data.</CardDescription>
          </CardHeader>
          <CardContent className="aspect-[16/10]">
            <iframe
              width="100%"
              height="100%"
              className="rounded-md border border-border"
              loading="lazy"
              allowFullScreen
              src={mapEmbedUrl}
              title="OpenStreetMap Embed"
            ></iframe>
            <p className="text-xs text-muted-foreground mt-2">
              This is an embedded OpenStreetMap view. Markers and detailed geographic clustering would require more advanced integration.
              The map is centered around: {mapCenter.lat.toFixed(4)}, {mapCenter.lon.toFixed(4)}.
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ImpactAnalysisPage;