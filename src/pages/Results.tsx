import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, RefreshCw, ExternalLink } from 'lucide-react';
import { FormData } from '@/components/ChangeAssessmentForm';
import { supabase } from '@/integrations/supabase/client';


interface StrategyRecommendation {
  summary: string;
  actionPlan: string;
  stakeholderFocus: string;
  trainingLevel: string;
  communicationFrequency: string;
  frameworks: string;
  relatedResources?: Array<{
    title: string;
    url: string;
    description: string;
  }>;
}

interface ArticleSnippet {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

const Results: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData | null>(null);
  const [recommendation, setRecommendation] = useState<StrategyRecommendation | null>(null);
  const [articles, setArticles] = useState<ArticleSnippet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);


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

  // Separate effect to handle articles after recommendation is set
  useEffect(() => {
    if (formData) {
      fetchRelevantArticles(formData);
    }
  }, [recommendation, formData]);

  const generateRecommendation = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      const { data: response, error } = await supabase.functions.invoke('generate-strategy', {
        body: data
      });

      if (error) {
        console.error('Error calling generate-strategy function:', error);
        throw error;
      }

      setRecommendation(response);
    } catch (error) {
      console.error('Failed to generate AI strategy, using fallback:', error);
      // Fallback to original mock generation
      const mockRecommendation: StrategyRecommendation = {
        summary: generateStrategySummary(data),
        actionPlan: generateActionPlan(data),
        stakeholderFocus: generateStakeholderFocus(data),
        trainingLevel: generateTrainingLevel(data),
        communicationFrequency: generateCommunicationFrequency(data),
        frameworks: generateFrameworks(data).join(', '),
        relatedResources: generateMockResources(data)
      };
      setRecommendation(mockRecommendation);
    } finally {
      setIsLoading(false);
    }
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

  const generateActionPlan = (data: FormData): string => {
    const urgencyActions = {
      high: [
        "• Establish emergency change leadership team within 48 hours",
        "• Conduct rapid stakeholder impact assessment",
        "• Deploy immediate communication to all affected parties"
      ],
      medium: [
        "• Form cross-functional change management team",
        "• Develop comprehensive stakeholder engagement plan",
        "• Create detailed change timeline and milestones"
      ],
      low: [
        "• Conduct thorough organizational readiness assessment",
        "• Build coalition of change champions across departments",
        "• Design phased implementation approach with pilot programs"
      ]
    };

    const commonActions = [
      `• Tailor training programs for ${data.changeTypes.join(' and ').toLowerCase()} changes`,
      `• Establish feedback mechanisms for ${data.stakeholderGroups.length} stakeholder groups`
    ];

    return urgencyActions[data.urgency].concat(commonActions).join('\n');
  };

  const generateMockResources = (data: FormData) => {
    const industrySpecific = {
      Technology: [
        {
          title: "How Amazon Transformed Its Corporate Culture Through Strategic Change Management",
          url: "https://hbr.org/2021/10/how-amazon-manages-change",
          description: "Harvard Business Review case study on Amazon's systematic approach to managing organizational transformation while maintaining innovation culture."
        },
        {
          title: "Microsoft's Digital Transformation: A Change Management Success Story",
          url: "https://www.mckinsey.com/business-functions/people-and-organizational-performance/our-insights/the-organization-blog/how-microsoft-reinvented-itself",
          description: "McKinsey analysis of Microsoft's cultural and technological transformation under Satya Nadella's leadership."
        }
      ],
      Healthcare: [
        {
          title: "Mayo Clinic's Organizational Change: Putting Patients First",
          url: "https://hbr.org/2017/03/how-mayo-clinic-redesigned-primary-care",
          description: "Harvard Business Review examines Mayo Clinic's patient-centered care transformation and change management strategies."
        },
        {
          title: "Cleveland Clinic's Cultural Transformation Journey",
          url: "https://www.nejm.org/doi/full/10.1056/NEJMp1213772",
          description: "New England Journal of Medicine case study on Cleveland Clinic's systematic approach to cultural change in healthcare."
        }
      ],
      Finance: [
        {
          title: "JPMorgan Chase's Digital Banking Transformation",
          url: "https://hbr.org/2019/12/how-jpmorgan-chase-has-digitized-its-consumer-bank",
          description: "Harvard Business Review analysis of JPMorgan's digital transformation and change management in traditional banking."
        },
        {
          title: "Goldman Sachs' Cultural Change: From Elite Investment Bank to Digital Leader",
          url: "https://www.mckinsey.com/industries/financial-services/our-insights/the-future-of-work-in-technology",
          description: "McKinsey insights on Goldman Sachs' transformation from traditional investment banking to technology-driven financial services."
        }
      ],
      Retail: [
        {
          title: "Walmart's E-commerce Transformation: Competing with Amazon",
          url: "https://hbr.org/2017/04/how-walmart-is-beating-amazon-at-its-own-game",
          description: "Harvard Business Review case study on Walmart's strategic transformation to compete in the digital marketplace."
        },
        {
          title: "Target's Digital Transformation and Cultural Change",
          url: "https://www.mckinsey.com/industries/retail/our-insights/how-retailers-can-keep-up-with-consumers",
          description: "McKinsey analysis of Target's omnichannel transformation and organizational change management."
        }
      ]
    };

    const defaultResources = [
      {
        title: "The Science of Successful Organizational Change",
        url: "https://hbr.org/2021/07/the-science-of-organizational-change",
        description: "Harvard Business Review's comprehensive guide to evidence-based change management practices across industries."
      },
      {
        title: "Leading Change: Why Transformation Efforts Fail",
        url: "https://hbr.org/1995/05/leading-change-why-transformation-efforts-fail",
        description: "John Kotter's seminal Harvard Business Review article on the eight-step process for successful organizational transformation."
      }
    ];

    return industrySpecific[data.industry as keyof typeof industrySpecific] || defaultResources;
  };

  const fetchRelevantArticles = async (data: FormData) => {
    setIsLoadingArticles(true);
    try {
      // Use AI-generated resources if available, otherwise fallback to mock
      if (recommendation?.relatedResources && recommendation.relatedResources.length > 0) {
        const aiArticles: ArticleSnippet[] = recommendation.relatedResources.map(resource => ({
          title: resource.title,
          url: resource.url,
          snippet: resource.description,
          source: "AI-Generated Resource"
        }));
        setArticles(aiArticles);
      } else {
        // Fallback to mock data with industry-specific direct articles
        const industryArticles = {
          Technology: [
            {
              title: "How Netflix Reinvented HR Through Organizational Change",
              url: "https://hbr.org/2014/01/how-netflix-reinvented-hr",
              snippet: "Harvard Business Review explores Netflix's revolutionary approach to talent management and organizational culture transformation.",
              source: "Harvard Business Review"
            },
            {
              title: "Google's Project Aristotle: Building Perfect Teams Through Change",
              url: "https://www.nytimes.com/2016/02/28/magazine/what-google-learned-from-its-quest-to-build-the-perfect-team.html",
              snippet: "New York Times investigation into Google's data-driven approach to team effectiveness and organizational change.",
              source: "New York Times"
            }
          ],
          Healthcare: [
            {
              title: "How Virginia Mason Medical Center Eliminated Waste and Improved Patient Care",
              url: "https://hbr.org/2005/06/going-lean-in-health-care",
              snippet: "Harvard Business Review case study on Virginia Mason's lean transformation in healthcare delivery.",
              source: "Harvard Business Review"
            },
            {
              title: "Intermountain Healthcare's Data-Driven Transformation",
              url: "https://hbr.org/2014/02/intermountain-healthcares-approach-to-quality-improvement",
              snippet: "How Intermountain Healthcare used systematic change management to improve patient outcomes and reduce costs.",
              source: "Harvard Business Review"
            }
          ],
          Finance: [
            {
              title: "How ING Bank Transformed Into an Agile Organization",
              url: "https://hbr.org/2017/01/the-agile-transformation-at-ing",
              snippet: "Harvard Business Review examines ING's radical organizational restructuring and agile transformation journey.",
              source: "Harvard Business Review"
            },
            {
              title: "DBS Bank's Digital Transformation: From Traditional Bank to Tech Company",
              url: "https://hbr.org/2016/11/how-dbs-bank-pursued-a-digital-business-transformation",
              snippet: "Case study of DBS Bank's comprehensive digital transformation and cultural change initiative.",
              source: "Harvard Business Review"
            }
          ],
          Retail: [
            {
              title: "How Zara's Supply Chain Innovation Transformed Fast Fashion",
              url: "https://hbr.org/2004/06/how-fast-fashion-works",
              snippet: "Harvard Business Review analysis of Zara's revolutionary supply chain transformation and organizational agility.",
              source: "Harvard Business Review"
            },
            {
              title: "Best Buy's Turnaround: From Near-Bankruptcy to Digital Success",
              url: "https://hbr.org/2017/01/best-buys-ceo-on-learning-to-love-data",
              snippet: "How Best Buy's CEO led a comprehensive transformation to compete in the digital retail landscape.",
              source: "Harvard Business Review"
            }
          ]
        };

        const urgencyArticles = {
          high: [
            {
              title: "Crisis Management: Leading Through Rapid Organizational Change",
              url: "https://hbr.org/2020/04/how-to-lead-through-a-crisis",
              snippet: "Harvard Business Review's guide to managing rapid organizational change during crisis situations.",
              source: "Harvard Business Review"
            }
          ],
          medium: [
            {
              title: "The Systematic Approach to Organizational Transformation",
              url: "https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights/successful-transformations",
              snippet: "McKinsey research on best practices for structured organizational change management.",
              source: "McKinsey & Company"
            }
          ],
          low: [
            {
              title: "Building Sustainable Change: A Long-term Transformation Strategy",
              url: "https://sloanreview.mit.edu/article/the-hard-side-of-change-management/",
              snippet: "MIT Sloan Management Review on sustainable approaches to long-term organizational transformation.",
              source: "MIT Sloan Management Review"
            }
          ]
        };

        const industrySpecific = industryArticles[data.industry as keyof typeof industryArticles] || [];
        const urgencySpecific = urgencyArticles[data.urgency as keyof typeof urgencyArticles] || [];
        
        const mockArticles: ArticleSnippet[] = [
          ...industrySpecific.slice(0, 2),
          ...urgencySpecific,
          {
            title: "Eight Steps to Transforming Your Organization",
            url: "https://hbr.org/2007/01/leading-change-why-transformation-efforts-fail",
            snippet: "John Kotter's foundational framework for successful organizational change, based on decades of research and real-world applications.",
            source: "Harvard Business Review"
          }
        ].slice(0, 3);
        setArticles(mockArticles);
      }
    } catch (error) {
      console.error('Error setting up articles:', error);
    } finally {
      setIsLoadingArticles(false);
    }
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
              <CardContent className="flex items-center min-h-[120px]">
                <p className="leading-relaxed">{recommendation.summary}</p>
              </CardContent>
            </Card>

            {/* Action Plan */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-accent">Immediate Action Plan</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center min-h-[120px]">
                <div className="prose prose-sm max-w-none w-full">
                  <div className="whitespace-pre-line leading-relaxed">{recommendation.actionPlan}</div>
                </div>
              </CardContent>
            </Card>

            {/* Stakeholder Focus */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-accent">Stakeholder Focus</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center min-h-[120px]">
                <p className="leading-relaxed">{recommendation.stakeholderFocus}</p>
              </CardContent>
            </Card>

            {/* Training Level */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-accent">Training Level</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center min-h-[120px]">
                <p className="leading-relaxed">{recommendation.trainingLevel}</p>
              </CardContent>
            </Card>

            {/* Communication Frequency */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-accent">Communication Frequency</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center min-h-[120px]">
                <p className="leading-relaxed">{recommendation.communicationFrequency}</p>
              </CardContent>
            </Card>

            {/* Frameworks */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-accent">Recommended Frameworks</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center min-h-[120px]">
                <p className="leading-relaxed">{recommendation.frameworks}</p>
              </CardContent>
            </Card>

            {/* Relevant Articles & Case Studies */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-accent">Success Stories & Best Practices</CardTitle>
                <CardDescription>
                  Learn from organizations similar to yours who have successfully implemented change management programs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingArticles ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin mr-2 text-primary" />
                    <span>Finding relevant case studies...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {articles.map((article, index) => (
                      <div key={index} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm leading-tight flex-1">{article.title}</h4>
                          <ExternalLink className="w-4 h-4 text-muted-foreground ml-2 flex-shrink-0" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{article.snippet}</p>
                         <div className="flex items-center justify-between">
                           <Badge variant="outline" className="text-xs">{article.source}</Badge>
                           <Button
                             variant="ghost"
                             size="sm"
                             className="text-xs p-2 h-auto"
                             onClick={() => window.open(article.url, '_blank')}
                           >
                             Read More
                           </Button>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
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