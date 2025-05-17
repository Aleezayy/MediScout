import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getSyntheticData } from '@/lib/syntheticDataManager';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, Eye } from 'lucide-react';


const DataExplorerPage = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setData(getSyntheticData());
  }, []);

  const uniqueConditions = useMemo(() => {
    const conditions = new Set(data.map(p => p.conditionAssigned));
    return ['all', ...Array.from(conditions)];
  }, [data]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = data;
    if (searchTerm) {
      filtered = filtered.filter(p =>
        Object.values(p).some(val => {
          if (typeof val === 'string') return val.toLowerCase().includes(searchTerm.toLowerCase());
          if (typeof val === 'number') return val.toString().toLowerCase().includes(searchTerm.toLowerCase());
          return false;
        }
        )
      );
    }
    if (filterCondition !== 'all') {
      filtered = filtered.filter(p => p.conditionAssigned === filterCondition);
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return filtered;
  }, [data, searchTerm, filterCondition, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '▲' : '▼';
    }
    return <ArrowUpDown className="inline ml-1 h-3 w-3 opacity-50" />;
  };
  
  const getRiskBadgeVariant = (score) => {
    if (score >= 7) return 'destructive';
    if (score >= 4) return 'warning'; 
    return 'success'; 
  };
  
  const getRiskLabel = (score) => {
    if (score >= 7) return 'High';
    if (score >= 4) return 'Medium';
    return 'Low';
  };

  const handleOpenDialog = (patient) => {
    setSelectedPatient(patient);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedPatient(null);
  };


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">Community Data Explorer</h1>
          <p className="text-muted-foreground">Browse, filter, and sort synthetic community health records.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-card/80 backdrop-blur-sm rounded-lg shadow">
        <Input
          placeholder="Search records..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm text-foreground placeholder:text-muted-foreground bg-background/50 focus:bg-background"
        />
        <Select value={filterCondition} onValueChange={setFilterCondition}>
          <SelectTrigger className="w-full sm:w-[220px] text-foreground bg-background/50 focus:bg-background">
            <SelectValue placeholder="Filter by condition" />
          </SelectTrigger>
          <SelectContent>
            {uniqueConditions.map(condition => (
              <SelectItem key={condition} value={condition}>
                {condition === 'all' ? 'All Conditions' : condition}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto bg-card/80 backdrop-blur-sm rounded-lg shadow">
        <Table>
          <TableCaption>A list of synthetic community health records. Click a row to view details.</TableCaption>
          <TableHeader>
            <TableRow className="border-b-border/50">
              <TableHead onClick={() => requestSort('date')} className="cursor-pointer hover:text-primary transition-colors">Date {getSortIndicator('date')}</TableHead>
              <TableHead onClick={() => requestSort('age')} className="cursor-pointer hover:text-primary transition-colors">Age {getSortIndicator('age')}</TableHead>
              <TableHead onClick={() => requestSort('gender')} className="cursor-pointer hover:text-primary transition-colors">Gender {getSortIndicator('gender')}</TableHead>
              <TableHead onClick={() => requestSort('location')} className="cursor-pointer hover:text-primary transition-colors">Location {getSortIndicator('location')}</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead onClick={() => requestSort('simulatedRiskScore')} className="cursor-pointer hover:text-primary transition-colors">Risk {getSortIndicator('simulatedRiskScore')}</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.map((patient) => (
              <Dialog key={patient.id} open={selectedPatient?.id === patient.id && isDialogOpen} onOpenChange={(open) => open ? handleOpenDialog(patient) : handleCloseDialog()}>
                <DialogTrigger asChild>
                  <TableRow onClick={() => handleOpenDialog(patient)} className="cursor-pointer hover:bg-muted/30 transition-colors">
                    <TableCell>{new Date(patient.date).toLocaleDateString()}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.location}</TableCell>
                    <TableCell>{patient.conditionAssigned}</TableCell>
                    <TableCell>
                      <Badge variant={getRiskBadgeVariant(patient.simulatedRiskScore)}>
                        {getRiskLabel(patient.simulatedRiskScore)} ({patient.simulatedRiskScore})
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" aria-label="View Details">
                         <Eye className="h-4 w-4 text-primary/80 hover:text-primary" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </DialogTrigger>
                {selectedPatient?.id === patient.id && (
                  <DialogContent className="sm:max-w-lg bg-gradient-to-br from-card via-background to-card/80 text-card-foreground border-primary/30">
                    <DialogHeader>
                      <DialogTitle className="text-2xl text-primary">Record Details (ID: {selectedPatient.id})</DialogTitle>
                      <DialogDescription>
                        Detailed information for the selected community record. AI insights are simulated.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <p><strong className="text-muted-foreground">Date:</strong> {new Date(selectedPatient.date).toLocaleDateString()}</p>
                        <p><strong className="text-muted-foreground">Age:</strong> {selectedPatient.age}</p>
                        <p><strong className="text-muted-foreground">Gender:</strong> {selectedPatient.gender}</p>
                        <p><strong className="text-muted-foreground">Location:</strong> {selectedPatient.location}</p>
                      </div>
                      <p><strong className="text-muted-foreground">Symptoms:</strong> {selectedPatient.symptomsText}</p>
                      <div>
                        <h4 className="font-semibold text-primary mb-1">Vitals:</h4>
                        <ul className="list-disc list-inside text-sm ml-4 space-y-0.5">
                          <li>Temperature: {selectedPatient.vitals.temperature}°C</li>
                          <li>Blood Pressure: {selectedPatient.vitals.bloodPressure} mmHg</li>
                          <li>Heart Rate: {selectedPatient.vitals.heartRate} bpm</li>
                          <li>Respiratory Rate: {selectedPatient.vitals.respiratoryRate} breaths/min</li>
                        </ul>
                      </div>
                      <p><strong className="text-muted-foreground">Assigned Condition:</strong> {selectedPatient.conditionAssigned}</p>
                      <p><strong className="text-muted-foreground">Image Placeholder:</strong> {selectedPatient.imagePlaceholder}</p>
                      
                      <div className="mt-2 p-3 bg-muted/30 rounded-md border border-dashed border-accent/50">
                        <h4 className="font-semibold text-accent mb-1">Simulated AI Analysis:</h4>
                        <p><strong className="text-muted-foreground">Risk Score:</strong> 
                          <Badge variant={getRiskBadgeVariant(selectedPatient.simulatedRiskScore)} className="ml-1">
                            {getRiskLabel(selectedPatient.simulatedRiskScore)} ({selectedPatient.simulatedRiskScore})
                          </Badge>
                        </p>
                        <p><strong className="text-muted-foreground">Triage Category:</strong> {selectedPatient.simulatedAiTriageCategory}</p>
                        {selectedPatient.simulatedAiImageAnalysis && selectedPatient.simulatedAiImageAnalysis.confidence > 0 && (
                          <p><strong className="text-muted-foreground">Image Finding:</strong> {selectedPatient.simulatedAiImageAnalysis.finding} (Confidence: {selectedPatient.simulatedAiImageAnalysis.confidence * 100}%)</p>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                )}
              </Dialog>
            ))}
          </TableBody>
        </Table>
      </div>
      {filteredAndSortedData.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No records match your criteria.</p>
      )}
    </motion.div>
  );
};

export default DataExplorerPage;