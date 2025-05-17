import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { getSimulatedAiPrediction } from '@/services/geminiService';
import { UploadCloud, Send, Activity, Thermometer, Weight } from 'lucide-react';
import { motion } from 'framer-motion';

const HealthDataFormPage = () => {
  const [symptoms, setSymptoms] = useState('');
  const [temperature, setTemperature] = useState('');
  const [weight, setWeight] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  const { currentUser, updateUserRecords } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) {
        toast({ title: "Input Error", description: "Please describe your symptoms.", variant: "destructive"});
        return;
    }
    setIsLoading(true);
    setAiResponse(null);

    try {
      const prediction = await getSimulatedAiPrediction(symptoms, imageFile);
      setAiResponse(prediction);

      const record = {
        date: new Date().toISOString(),
        symptoms,
        vitals: { temperature, weight },
        imageFile: imageFile ? { name: imageFile.name, type: imageFile.type, size: imageFile.size } : null,
        aiPrediction: { ...prediction, riskScore: parseFloat(prediction.confidence) * 10 } // Simulate risk score from confidence
      };
      
      updateUserRecords(currentUser.id, record);
      
      toast({ title: "Submission Successful", description: "Health data submitted and AI insights generated." });
      // Optionally navigate or clear form:
      // navigate('/patient/dashboard'); 
      // setSymptoms(''); setTemperature(''); setWeight(''); setImageFile(null); setImagePreview(null);

    } catch (error) {
      toast({ title: "Error", description: "Failed to get AI prediction or save data.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto space-y-8"
    >
      <Card className="shadow-xl border-primary/20">
        <CardHeader>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">New Health Entry</CardTitle>
          <CardDescription>Describe your symptoms and provide any relevant health information. Our AI will provide preliminary insights.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="symptoms" className="text-lg">Symptoms</Label>
              <Textarea
                id="symptoms"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g., fever, headache, body pain for 3 days..."
                rows={5}
                required
                className="bg-background/50 focus:bg-background text-base"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="temperature" className="flex items-center"><Thermometer className="mr-2 h-5 w-5 text-primary"/>Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  placeholder="e.g., 38.5"
                  className="bg-background/50 focus:bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="flex items-center"><Weight className="mr-2 h-5 w-5 text-primary"/>Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g., 65.0"
                  className="bg-background/50 focus:bg-background"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUpload" className="text-lg flex items-center"><UploadCloud className="mr-2 h-6 w-6 text-primary"/>Upload Image (Optional)</Label>
              <Input
                id="imageUpload"
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleImageChange}
                className="bg-background/50 focus:bg-background file:text-primary file:font-semibold"
              />
              {imagePreview && (
                <div className="mt-2 border border-dashed border-primary/50 p-2 rounded-md inline-block">
                  <img-replace src={imagePreview} alt="Image preview" className="max-h-40 rounded" />
                  <p className="text-xs text-muted-foreground mt-1">{imageFile?.name}</p>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full text-lg py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity" disabled={isLoading}>
              <Send className="mr-2 h-5 w-5"/>
              {isLoading ? 'Analyzing & Submitting...' : 'Get AI Insights & Submit'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {aiResponse && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
        <Card className="mt-8 shadow-lg border-accent/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center"><Activity className="mr-3 h-7 w-7 text-accent"/>AI Generated Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-base">
            <p><strong className="text-accent">Predicted Condition:</strong> {aiResponse.prediction} (Confidence: {aiResponse.confidence})</p>
            <p><strong className="text-muted-foreground">Advice & Precautions:</strong> {aiResponse.advice}</p>
            <p className="text-sm"><strong className="text-muted-foreground">Image Note:</strong> {aiResponse.imageAnalysis}</p>
            <p className="text-xs text-amber-500 dark:text-amber-400 mt-3">
              Disclaimer: This AI prediction is for informational purposes only and not a substitute for professional medical diagnosis. Please consult a healthcare provider.
            </p>
          </CardContent>
        </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HealthDataFormPage;