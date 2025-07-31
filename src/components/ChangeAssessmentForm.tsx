import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export interface FormData {
  organizationSize: string;
  industry: string;
  stakeholderGroups: string[];
  numberOfStakeholders: string;
  changeTypes: string[];
  urgency: string;
}

const industries = [
  'Information Technology',
  'Healthcare',
  'Manufacturing',
  'Financial Services',
  'Education',
  'Retail',
  'Logistics & Transportation',
  'Insurance',
  'Government',
  'Construction',
  'Energy & Utilities',
  'Media & Entertainment',
  'Non-Profit',
  'Other'
];

const stakeholderOptions = [
  'Leadership',
  'Frontline Employees',
  'Customers',
  'Suppliers',
  'Partners'
];

const changeTypeOptions = [
  'Technology',
  'Process',
  'Platform',
  'HR',
  'Compliance',
  'Culture'
];

export const ChangeAssessmentForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    organizationSize: '',
    industry: '',
    stakeholderGroups: [],
    numberOfStakeholders: '',
    changeTypes: [],
    urgency: ''
  });

  const handleStakeholderGroupChange = (group: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      stakeholderGroups: checked 
        ? [...prev.stakeholderGroups, group]
        : prev.stakeholderGroups.filter(g => g !== group)
    }));
  };

  const handleChangeTypeChange = (type: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      changeTypes: checked 
        ? [...prev.changeTypes, type]
        : prev.changeTypes.filter(t => t !== type)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.organizationSize || !formData.industry || !formData.numberOfStakeholders || !formData.urgency) {
      toast({
        title: "Please fill in all required fields",
        description: "All fields except multi-select options are required.",
        variant: "destructive"
      });
      return;
    }

    if (formData.stakeholderGroups.length === 0) {
      toast({
        title: "Please select stakeholder groups",
        description: "At least one stakeholder group must be selected.",
        variant: "destructive"
      });
      return;
    }

    if (formData.changeTypes.length === 0) {
      toast({
        title: "Please select change types",
        description: "At least one change type must be selected.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Store assessment data and navigate to email collection for free users
      sessionStorage.setItem('changeAssessmentData', JSON.stringify(formData));
      navigate('/email-collection');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error processing assessment",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto animate-fade-in">
      <CardHeader className="text-center pb-10">
        <CardTitle className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-wide">
          Change Management Assessment
        </CardTitle>
        <CardDescription className="text-xl mt-6 text-foreground/70 max-w-3xl mx-auto leading-relaxed">
          Help us understand your organization and change requirements to provide personalized recommendations
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-10">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Organization Size */}
          <div className="space-y-6">
            <Label className="text-xl font-bold text-foreground">Organization Size *</Label>
            <RadioGroup 
              value={formData.organizationSize} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, organizationSize: value }))}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="flex items-center space-x-3 p-6 glass-card rounded-modern hover:bg-white/20 transition-all duration-300 card-hover">
                <RadioGroupItem value="small" id="small" />
                <Label htmlFor="small" className="font-semibold cursor-pointer text-foreground">Small (0-50 employees)</Label>
              </div>
              <div className="flex items-center space-x-3 p-6 glass-card rounded-modern hover:bg-white/20 transition-all duration-300 card-hover">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="font-semibold cursor-pointer text-foreground">Medium (50-500 employees)</Label>
              </div>
              <div className="flex items-center space-x-3 p-6 glass-card rounded-modern hover:bg-white/20 transition-all duration-300 card-hover">
                <RadioGroupItem value="large" id="large" />
                <Label htmlFor="large" className="font-semibold cursor-pointer text-foreground">Large (&gt;500 employees)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Industry */}
          <div className="space-y-6">
            <Label className="text-xl font-bold text-foreground">Industry *</Label>
            <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
              <SelectTrigger className="w-full h-14 rounded-modern border-2 glass text-foreground font-medium input-focus">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent className="bg-background glass-card border rounded-modern">
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry} className="font-medium">{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stakeholder Groups */}
          <div className="space-y-6">
            <Label className="text-xl font-bold text-foreground">Affected Stakeholder Groups *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stakeholderOptions.map((group) => (
                <div key={group} className="flex items-center space-x-3 p-6 glass-card rounded-modern hover:bg-white/20 transition-all duration-300 card-hover">
                  <Checkbox
                    id={group}
                    checked={formData.stakeholderGroups.includes(group)}
                    onCheckedChange={(checked) => handleStakeholderGroupChange(group, checked as boolean)}
                  />
                  <Label htmlFor={group} className="font-semibold cursor-pointer text-foreground">{group}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Number of Stakeholders */}
          <div className="space-y-6">
            <Label className="text-xl font-bold text-foreground">Number of Impacted Stakeholders *</Label>
            <RadioGroup 
              value={formData.numberOfStakeholders} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, numberOfStakeholders: value }))}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <div className="flex items-center space-x-3 p-6 glass-card rounded-modern hover:bg-white/20 transition-all duration-300 card-hover">
                <RadioGroupItem value="0-50" id="stakeholders-0-50" />
                <Label htmlFor="stakeholders-0-50" className="font-semibold cursor-pointer text-foreground">0-50</Label>
              </div>
              <div className="flex items-center space-x-3 p-6 glass-card rounded-modern hover:bg-white/20 transition-all duration-300 card-hover">
                <RadioGroupItem value="50-100" id="stakeholders-50-100" />
                <Label htmlFor="stakeholders-50-100" className="font-semibold cursor-pointer text-foreground">50-100</Label>
              </div>
              <div className="flex items-center space-x-3 p-6 glass-card rounded-modern hover:bg-white/20 transition-all duration-300 card-hover">
                <RadioGroupItem value="100-500" id="stakeholders-100-500" />
                <Label htmlFor="stakeholders-100-500" className="font-semibold cursor-pointer text-foreground">100-500</Label>
              </div>
              <div className="flex items-center space-x-3 p-6 glass-card rounded-modern hover:bg-white/20 transition-all duration-300 card-hover">
                <RadioGroupItem value=">500" id="stakeholders-500plus" />
                <Label htmlFor="stakeholders-500plus" className="font-semibold cursor-pointer text-foreground">&gt;500</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Type of Change */}
          <div className="space-y-6">
            <Label className="text-xl font-bold text-foreground">Type of Change *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {changeTypeOptions.map((type) => (
                <div key={type} className="flex items-center space-x-3 p-6 glass-card rounded-modern hover:bg-white/20 transition-all duration-300 card-hover">
                  <Checkbox
                    id={type}
                    checked={formData.changeTypes.includes(type)}
                    onCheckedChange={(checked) => handleChangeTypeChange(type, checked as boolean)}
                  />
                  <Label htmlFor={type} className="font-semibold cursor-pointer text-foreground">{type}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Urgency */}
          <div className="space-y-6">
            <Label className="text-xl font-bold text-foreground">Urgency Level *</Label>
            <Select value={formData.urgency} onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}>
              <SelectTrigger className="w-full h-14 rounded-modern border-2 glass text-foreground font-medium input-focus">
                <SelectValue placeholder="Select urgency level" />
              </SelectTrigger>
              <SelectContent className="bg-background glass-card border rounded-modern">
                <SelectItem value="low" className="font-medium">Low (8-12 weeks)</SelectItem>
                <SelectItem value="medium" className="font-medium">Medium (4-8 weeks)</SelectItem>
                <SelectItem value="high" className="font-medium">High (&lt;4 weeks)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-8">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full font-bold text-lg animate-scale-in"
              disabled={loading}
            >
              {loading ? "Preparing Your Summary..." : "Generate Summary"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};