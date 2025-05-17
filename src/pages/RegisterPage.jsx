import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { UserPlus, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { LOCATIONS, GENDERS } from '@/lib/dataGenerators.js';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    age: '',
    gender: '',
    location: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    if (parseInt(formData.age) < 0 || parseInt(formData.age) > 120) {
      toast({ title: "Error", description: "Please enter a valid age.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    const { confirmPassword, ...userData } = formData;
    const success = register({ ...userData, age: parseInt(userData.age) });
    if (success) {
      navigate('/patient/dashboard');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-lg shadow-2xl bg-card/90 backdrop-blur-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <ShieldCheck className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Create Patient Account</CardTitle>
            <CardDescription className="text-center">Join MediScout to manage your health.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={formData.name} onChange={handleChange} required placeholder="Your full name" className="bg-background/50 focus:bg-background"/>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" value={formData.age} onChange={handleChange} required placeholder="Your age" className="bg-background/50 focus:bg-background"/>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="gender">Gender</Label>
                  <Select id="gender" onValueChange={(value) => handleSelectChange('gender', value)} required>
                    <SelectTrigger className="w-full bg-background/50 focus:bg-background">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDERS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="location">Location</Label>
                   <Select id="location" onValueChange={(value) => handleSelectChange('location', value)} required>
                    <SelectTrigger className="w-full bg-background/50 focus:bg-background">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
               <hr className="my-3 border-border/50"/>
              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={formData.username} onChange={handleChange} required placeholder="Choose a username" className="bg-background/50 focus:bg-background"/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" className="bg-background/50 focus:bg-background"/>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required placeholder="••••••••" className="bg-background/50 focus:bg-background"/>
                </div>
              </div>
              <Button type="submit" className="w-full text-lg py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity" disabled={isLoading}>
                <UserPlus className="mr-2 h-5 w-5" />
                {isLoading ? 'Registering...' : 'Register'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Login here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};
export default RegisterPage;