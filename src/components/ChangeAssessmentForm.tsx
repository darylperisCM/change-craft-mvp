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
      // Store assessment data and navigate to results
      sessionStorage.setItem('changeAssessmentData', JSON.stringify(formData));
      navigate('/results');
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
    <Card className="w-full max-w-4xl mx-auto shadow-card">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-3xl font-bold bg-hero-gradient bg-clip-text text-transparent">
          Change Management Assessment
        </CardTitle>
        <CardDescription className="text-lg mt-4">
          Help us understand your organization and change requirements to provide personalized recommendations
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Organization Size */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Organization Size *</Label>
            <RadioGroup 
              value={formData.organizationSize} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, organizationSize: value }))}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted transition-smooth">
                <RadioGroupItem value="small" id="small" />
                <Label htmlFor="small" className="font-medium cursor-pointer">Small (0-50 employees)</Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted transition-smooth">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="font-medium cursor-pointer">Medium (50-500 employees)</Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted transition-smooth">
                <RadioGroupItem value="large" id="large" />
                <Label htmlFor="large" className="font-medium cursor-pointer">Large (&gt;500 employees)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Industry */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Industry *</Label>
            <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stakeholder Groups */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Affected Stakeholder Groups *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stakeholderOptions.map((group) => (
                <div key={group} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted transition-smooth">
                  <Checkbox
                    id={group}
                    checked={formData.stakeholderGroups.includes(group)}
                    onCheckedChange={(checked) => handleStakeholderGroupChange(group, checked as boolean)}
                  />
                  <Label htmlFor={group} className="font-medium cursor-pointer">{group}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Number of Stakeholders */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Number of Impacted Stakeholders *</Label>
            <RadioGroup 
              value={formData.numberOfStakeholders} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, numberOfStakeholders: value }))}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted transition-smooth">
                <RadioGroupItem value="0-50" id="stakeholders-0-50" />
                <Label htmlFor="stakeholders-0-50" className="font-medium cursor-pointer">0-50</Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted transition-smooth">
                <RadioGroupItem value="50-100" id="stakeholders-50-100" />
                <Label htmlFor="stakeholders-50-100" className="font-medium cursor-pointer">50-100</Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted transition-smooth">
                <RadioGroupItem value="100-500" id="stakeholders-100-500" />
                <Label htmlFor="stakeholders-100-500" className="font-medium cursor-pointer">100-500</Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted transition-smooth">
                <RadioGroupItem value=">500" id="stakeholders-500plus" />
                <Label htmlFor="stakeholders-500plus" className="font-medium cursor-pointer">&gt;500</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Type of Change */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Type of Change *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {changeTypeOptions.map((type) => (
                <div key={type} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted transition-smooth">
                  <Checkbox
                    id={type}
                    checked={formData.changeTypes.includes(type)}
                    onCheckedChange={(checked) => handleChangeTypeChange(type, checked as boolean)}
                  />
                  <Label htmlFor={type} className="font-medium cursor-pointer">{type}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Urgency */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Urgency Level *</Label>
            <Select value={formData.urgency} onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select urgency level" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="low">Low (8-12 weeks)</SelectItem>
                <SelectItem value="medium">Medium (4-8 weeks)</SelectItem>
                <SelectItem value="high">High (&lt;4 weeks)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-6">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full bg-hero-gradient hover:opacity-90 transition-smooth"
              disabled={loading}
            >
              {loading ? "Generating Strategy..." : "Generate Change Management Strategy"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};