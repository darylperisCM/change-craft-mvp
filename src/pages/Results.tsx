import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import { FormData } from '@/components/ChangeAssessmentForm';
import { useAuth } from '@/hooks/useAuth';

interface StrategyRecommendation {
  strategySummary: string;
  stakeholderFocus: string;
  trainingLevel: string;
  communicationFrequency: string;
  frameworks: string[];
}

const Results: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [recommendation, setRecommendation] = useState<StrategyRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  useEffect(() => {
    const storedData = sessionStorage.getItem('changeAssessmentData');
    if (!storedData) {
      navigate('/');
      return;
    }
    
    const data = JSON.parse(storedData) as FormData;
    setFormData(data);
    generateRecommendation(data);
  }, [navigate]);

  const generateRecommendation = async (data: FormData) => {
    setIsLoading(true);
    
    // Simulate API call to ChatGPT 4o
    // In a real implementation, this would call your backend API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock recommendation based on form data
    const mockRecommendation: StrategyRecommendation = {
      strategySummary: generateStrategySummary(data),
      stakeholderFocus: generateStakeholderFocus(data),
      trainingLevel: generateTrainingLevel(data),
      communicationFrequency: generateCommunicationFrequency(data),
      frameworks: generateFrameworks(data)
    };
    
    setRecommendation(mockRecommendation);
    setIsLoading(false);
  };

  const generateStrategySummary = (data: FormData): string => {
    const urgencyMap = {
      high: 'rapid deployment',
      medium: 'structured phased approach',
      low: 'comprehensive long-term strategy'
    };
    
    const sizeMap = {
      small: 'agile and flexible',
      medium: 'balanced coordination',
      large: 'enterprise-wide orchestration'
    };

    return `Based on your ${data.organizationSize} ${data.industry.toLowerCase()} organization implementing ${data.changeTypes.join(', ').toLowerCase()} changes, we recommend a ${urgencyMap[data.urgency]} with ${sizeMap[data.organizationSize]} focusing on your ${data.stakeholderGroups.length} key stakeholder groups. This strategy should emphasize clear communication, structured training, and continuous feedback loops to ensure successful adoption across approximately ${data.numberOfStakeholders} impacted individuals.`;
  };

  const generateStakeholderFocus = (data: FormData): string => {
    const priorities = data.stakeholderGroups.map(group => {
      switch (group) {
        case 'Leadership': return 'Executive alignment and sponsorship';
        case 'Frontline Employees': return 'Day-to-day operational adaptation';
        case 'Customers': return 'Experience continuity and value communication';
        case 'Suppliers': return 'Partnership alignment and process integration';
        case 'Partners': return 'Collaborative transition and mutual benefits';
        default: return group;
      }
    });
    
    return `Primary focus areas: ${priorities.join(', ')}. Each stakeholder group requires tailored messaging and engagement strategies to address their specific concerns and ensure buy-in throughout the change process.`;
  };

  const generateTrainingLevel = (data: FormData): string => {
    const complexityScore = data.changeTypes.length + (data.urgency === 'high' ? 2 : data.urgency === 'medium' ? 1 : 0);
    
    if (complexityScore >= 4) {
      return 'Intensive training program with multiple touchpoints, hands-on workshops, and ongoing support. Recommended 40+ hours of training content with role-specific modules.';
    } else if (complexityScore >= 2) {
      return 'Moderate training approach with focused sessions and practical exercises. Recommended 20-30 hours of training with follow-up reinforcement.';
    } else {
      return 'Basic orientation and awareness sessions with self-paced learning resources. Recommended 10-15 hours of foundational training.';
    }
  };

  const generateCommunicationFrequency = (data: FormData): string => {
    const frequencyMap = {
      high: 'Daily updates during implementation, weekly town halls, and bi-weekly leadership briefings',
      medium: 'Bi-weekly updates, monthly all-hands meetings, and quarterly stakeholder reviews',
      low: 'Weekly updates, monthly progress reports, and quarterly milestone celebrations'
    };
    
    return frequencyMap[data.urgency] + '. Utilize multiple channels including email, intranet, team meetings, and dedicated change champion networks to ensure consistent messaging across all stakeholder groups.';
  };

  const generateFrameworks = (data: FormData): string[] => {
    const frameworks = ['ADKAR (Awareness, Desire, Knowledge, Ability, Reinforcement)'];
    
    if (data.organizationSize === 'large') {
      frameworks.push('Kotter\'s 8-Step Process');
    }
    
    if (data.changeTypes.includes('Technology') || data.changeTypes.includes('Platform')) {
      frameworks.push('Lean Change Management');
    }
    
    if (data.changeTypes.includes('Culture')) {
      frameworks.push('Bridge Transition Model');
    }
    
    if (data.urgency === 'high') {
      frameworks.push('Agile Change Management');
    }
    
    if (data.stakeholderGroups.includes('Customers')) {
      frameworks.push('Design Thinking for Change');
    }
    
    return frameworks;
  };

  if (!formData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-section-gradient">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assessment
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-hero-gradient bg-clip-text text-transparent mb-4">
              Your Change Management Strategy
            </h1>
            <p className="text-lg text-muted-foreground">
              Personalized recommendations based on your organization's profile
            </p>
          </div>
        </div>

        {/* Assessment Summary */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Assessment Summary
              <Badge variant="secondary">{formData.industry}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="font-semibold text-sm text-muted-foreground">Organization Size</p>
                <p className="capitalize">{formData.organizationSize}</p>
              </div>
              <div>
                <p className="font-semibold text-sm text-muted-foreground">Stakeholders Impacted</p>
                <p>{formData.numberOfStakeholders}</p>
              </div>
              <div>
                <p className="font-semibold text-sm text-muted-foreground">Urgency Level</p>
                <p className="capitalize">{formData.urgency}</p>
              </div>
              <div>
                <p className="font-semibold text-sm text-muted-foreground">Stakeholder Groups</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.stakeholderGroups.map(group => (
                    <Badge key={group} variant="outline" className="text-xs">{group}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold text-sm text-muted-foreground">Change Types</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.changeTypes.map(type => (
                    <Badge key={type} variant="outline" className="text-xs">{type}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <Card className="shadow-card">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-lg font-medium">Generating your personalized strategy...</p>
                <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
              </div>
            </CardContent>
          </Card>
        ) : recommendation ? (
          <div className="space-y-6">
            {/* Strategy Summary */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-accent">Strategy Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{recommendation.strategySummary}</p>
              </CardContent>
            </Card>

            {/* Stakeholder Focus */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-accent">Stakeholder Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{recommendation.stakeholderFocus}</p>
              </CardContent>
            </Card>

            {/* Training Level */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-accent">Training Level</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{recommendation.trainingLevel}</p>
              </CardContent>
            </Card>

            {/* Communication Frequency */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-accent">Communication Frequency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{recommendation.communicationFrequency}</p>
              </CardContent>
            </Card>

            {/* Frameworks */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-accent">Recommended Frameworks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recommendation.frameworks.map((framework, index) => (
                    <Badge key={index} variant="secondary" className="mr-2 mb-2">
                      {framework}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  These frameworks are specifically selected based on your organization's characteristics and change requirements.
                </p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-6">
              <Button onClick={() => window.print()} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button onClick={() => navigate('/')} className="bg-hero-gradient">
                New Assessment
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Results;