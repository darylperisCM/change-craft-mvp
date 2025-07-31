import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, RefreshCw, ExternalLink } from 'lucide-react';
import { FormData } from '@/components/ChangeAssessmentForm';
import { supabase } from '@/integrations/supabase/client';

const industryResources = {
  "Information Technology": [
    { title: "5 Change Management Trends for 2025", url: "https://www.gpstrategies.com/resources/article/5-change-management-trends-for-2025/" },
    { title: "Your Ultimate Guide to IT Change Management in 2025", url: "https://www.atomicwork.com/itsm/it-change-management-guide" },
    { title: "ITIL Change Management: Best Practices 2025", url: "https://www.simplilearn.com/itil-change-management-article" }
  ],
  "Healthcare": [
    { title: "Change Management in Healthcare: Examples, Risks", url: "https://whatfix.com/blog/healthcare-change-management/" },
    { title: "2025 Global Health Care Executive Outlook (Deloitte)", url: "https://www.deloitte.com/us/en/insights/industry/health-care/life-sciences-and-health-care-industry-outlooks/2025-global-health-care-executive-outlook.html" },
    { title: "Health care transformation and growth: 2025 and beyond (EY)", url: "https://www.ey.com/en_us/insights/strategy/health-care-transformation-and-growth-2025-and-beyond" }
  ],
  "Manufacturing": [
    { title: "Organizational Change Management in 2025", url: "https://www.onindus.com/what-is-organizational-change-management-and-why-does-your-business-need-it-in-2025/" },
    { title: "9 Proven Change Management Models and Frameworks in 2025", url: "https://lumenalta.com/insights/9-proven-change-management-models-and-frameworks-in-2025" }
  ],
  "Financial Services": [
    { title: "How Leaders Drive Successful Change in Financial Services", url: "https://www.edstellar.com/blog/change-management-in-financial-services" },
    { title: "What is Financial Services Change Management?", url: "https://www.solvexia.com/glossary/financial-services-change-management" },
    { title: "Four regulatory priorities to drive financial institutions' focus in 2025 (EY)", url: "https://www.ey.com/en_gl/insights/financial-services/four-regulatory-priorities-to-drive-financial-institutions-focus-in-2025" }
  ],
  "Education": [
    { title: "9 Best Change Management Courses To Take In 2025", url: "https://thedigitalprojectmanager.com/project-management/best-change-management-courses/" }
  ],
  "Retail": [
    { title: "Top 10 Retail Strategy and Change Management Challenges in 2025", url: "https://www.rpesolutions.com/top-10-retail-strategy-and-change-management-challenges-in-2025-ai-data-readiness-transformation/" },
    { title: "Change Management in Retail: A Corporate Guide (2025) (Shopify)", url: "https://www.shopify.com/in/retail/change-management-in-retail" }
  ],
  "Logistics & Transportation": [
    { title: "Logistics trends 2025: Technologies, AI, challenges and opportunities", url: "https://acrosslogistics.com/blog/en/logistics-trends" },
    { title: "Changes in logistics and transportation in 2025", url: "https://onturtle.eu/en/changes-in-logistics-and-transportation-in-2025/" },
    { title: "4 Best Practices for Logistics Managers in 2025", url: "https://www.supplychaindive.com/news/best-practices-for-logistics-managers-in-2025/743509/" }
  ],
  "Insurance": [
    { title: "Digital Transformation in the Insurance Industry: A Change Management Guide", url: "https://www.prosci.com/blog/digital-transformation-in-insurance-industry" },
    { title: "Navigating 2025: Embracing Change to Build a Resilient Insurance Future", url: "https://riskandinsurance.com/navigating-2025-embracing-change-to-build-a-resilient-commercial-insurance-future/" }
  ],
  "Construction": [
    { title: "Change Management in Construction: Strategies for Success", url: "https://pinnacleinfotech.com/change-management-in-construction/" },
    { title: "Construction Project Management in 2025: What Will Change? (PDF)", url: "https://www.cmaanet.org/sites/default/files/resource/Construction%20Project.pdf" }
  ],
  "Energy & Utilities": [
    { title: "Transformation in Energy, Utilities, and Resources: Paving the Path to 2025", url: "https://sitsi.pacanalyst.com/transformation-in-energy-utilities-and-resources-paving-the-path-to-2025-and-beyond/" },
    { title: "2025 Energy and Utilities Trends: Five Key Themes", url: "https://www.capgemini.com/insights/expert-perspectives/2025-energy-and-utilities-trends-five-key-themes-shaping-the-transition/" }
  ],
  "Media & Entertainment": [
    { title: "Digital Transformation in Media & Entertainment for 2025", url: "https://www.edstellar.com/blog/digital-transformation-in-media-entertainment" },
    { title: "2025 Media and Entertainment Outlook (Deloitte)", url: "https://www.deloitte.com/us/en/insights/industry/technology/technology-media-telecom-outlooks/2025-media-entertainment-outlook.html" }
  ],
  "Non-profit": [
    { title: "The State of Change Management in the Nonprofit Sector 2025", url: "https://stateofchangemanagement.org" },
    { title: "Best Practices in Change Management for Nonprofit Organizations", url: "https://www.convergentnonprofit.com/blog/p/item/57783/best-practices-in-change-management-for-nonprofit-organizations" }
  ]
};


interface StrategyRecommendation {
  summary: string;
  immediateActionPlan: string;
  stakeholderFocus: string;
  trainingLevel: string;
  communicationFrequency: string;
  recommendedFrameworks: string;
  recommendedResources: string;
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
  const [userEmail, setUserEmail] = useState<string | null>(null);


  useEffect(() => {
    const storedData = sessionStorage.getItem('changeAssessmentData');
    if (!storedData) {
      navigate('/');
      return;
    }
    
    const data = JSON.parse(storedData) as FormData;
    setFormData(data);
    
    // Get user email
    const email = sessionStorage.getItem('userEmail');
    setUserEmail(email);
    
    generateRecommendation(data, email);
  }, [navigate]);

  // Separate effect to handle articles after recommendation is set
  useEffect(() => {
    if (formData) {
      fetchRelevantArticles(formData);
    }
  }, [recommendation, formData]);

  const generateRecommendation = async (data: FormData, email?: string | null) => {
  setIsLoading(true);
  
  try {
    console.log('Invoking generate-strategy with data:', data);
    
    const { data: response, error } = await supabase.functions.invoke('generate-strategy', {
      body: { data } // Wrap data in object - important change
    });

    console.log('Supabase response:', response, 'Error:', error);

    if (error) {
      console.error('Supabase function error:', error);
      throw error;
    }

    // Check if response has the expected structure - CRITICAL FIX
    if (!response || typeof response !== 'object') {
      console.error('Invalid response format:', response);
      throw new Error('Invalid response format from generate-strategy function');
    }

    // Validate required fields - CRITICAL FIX
    const requiredFields = ['summary', 'immediateActionPlan', 'stakeholderFocus', 'trainingLevel', 'communicationFrequency', 'recommendedFrameworks', 'recommendedResources'];
    const missingFields = requiredFields.filter(field => !response[field]);
    
    if (missingFields.length > 0) {
      console.error('Response missing required fields:', missingFields);
      throw new Error(`Response missing required fields: ${missingFields.join(', ')}`);
    }

    console.log('✅ SUCCESS: Using AI-generated response');
    setRecommendation(response);
    
    // Send email with strategy if email is provided
    if (email && response) {
      try {
        await supabase.functions.invoke('send-strategy-email', {
          body: {
            email,
            strategyData: response,
            assessmentData: data
          }
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }
    }
    
  } catch (error) {
    console.error('❌ FALLBACK: Using hardcoded template responses due to error:', error);
    
    // Only use fallback if absolutely necessary
    const mockRecommendation: StrategyRecommendation = {
      summary: generateStrategySummary(data),
      immediateActionPlan: generateActionPlan(data),
      stakeholderFocus: generateStakeholderFocus(data),
      trainingLevel: generateTrainingLevel(data),
      communicationFrequency: generateCommunicationFrequency(data),
      recommendedFrameworks: generateFrameworks(data).join(', '),
      recommendedResources: generateRecommendedResources(data)
    };
    setRecommendation(mockRecommendation);
    
    // Send email with fallback strategy if email is provided
    if (email && mockRecommendation) {
      try {
        await supabase.functions.invoke('send-strategy-email', {
          body: {
            email,
            strategyData: mockRecommendation,
            assessmentData: data
          }
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }
    }
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

  const generateRecommendedResources = (data: FormData): string => {
    const resources = [];
    
    // Industry-specific resources
    if (data.industry === "Information Technology") {
      resources.push("**Digital Transformation Playbook** - BCG's comprehensive guide for tech companies: https://www.bcg.com/publications/2020/accelerating-digital-transformation");
    } else if (data.industry === "Healthcare") {
      resources.push("**Healthcare Change Management Guide** - Specialized resources for healthcare transformations: https://www.healthleadersmedia.com/innovation/mayo-clinic-shares-lessons-learned-transformation-patient-centered-care");
    } else if (data.industry === "Financial Services") {
      resources.push("**Financial Services Change Toolkit** - Regulatory-compliant change management for financial organizations: https://www.edstellar.com/blog/change-management-in-financial-services");
    } else {
      resources.push("**Industry Change Management Best Practices** - Comprehensive change management strategies: https://www.prosci.com/blog/change-management-best-practices");
    }
    
    // General high-quality resources
    resources.push("**Harvard Business Review Change Management Collection** - Evidence-based articles and case studies: https://hbr.org/topic/change-management");
    resources.push("**Kotter International Resources** - Free tools and assessments for organizational change: https://www.kotterinc.com/resources/");
    
    return resources.join("\n\n");
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
          title: "How Netflix Reinvented HR Through Organizational Change",
          url: "https://medium.com/@cultureamp/how-netflix-reinvented-hr-a-culture-transformation-story-8a1d7b8e9c45",
          description: "Medium article exploring Netflix's revolutionary approach to talent management and organizational culture transformation."
        },
        {
          title: "Microsoft's Growth Mindset: A Cultural Transformation",
          url: "https://www.linkedin.com/pulse/how-microsoft-transformed-its-culture-satya-nadella-growth-mindset",
          description: "LinkedIn article on Microsoft's cultural and technological transformation under Satya Nadella's leadership."
        }
      ],
      Healthcare: [
        {
          title: "Mayo Clinic's Patient-Centered Care Transformation",
          url: "https://www.healthleadersmedia.com/innovation/mayo-clinic-shares-lessons-learned-transformation-patient-centered-care",
          description: "Health Leaders Media examines Mayo Clinic's patient-centered care transformation and change management strategies."
        },
        {
          title: "Cleveland Clinic's Cultural Transformation Journey",
          url: "https://www.modernhealthcare.com/operations/cleveland-clinic-culture-change-patient-experience",
          description: "Modern Healthcare case study on Cleveland Clinic's systematic approach to cultural change in healthcare."
        }
      ],
      Finance: [
        {
          title: "DBS Bank's Digital Transformation Success",
          url: "https://www.finextra.com/newsarticle/38245/dbs-bank-digital-transformation-journey-case-study",
          description: "Finextra analysis of DBS Bank's comprehensive digital transformation and change management approach."
        },
        {
          title: "ING's Agile Transformation: Banking Revolution",
          url: "https://www.forbes.com/sites/stephentaub/2021/03/15/how-ing-bank-transformed-into-an-agile-organization/",
          description: "Forbes insights on ING's radical organizational restructuring and agile transformation journey."
        }
      ],
      Retail: [
        {
          title: "Walmart's Digital Commerce Transformation",
          url: "https://www.digitalcommerce360.com/2020/06/15/walmart-ecommerce-transformation-strategy/",
          description: "Digital Commerce 360 case study on Walmart's strategic transformation to compete in the digital marketplace."
        },
        {
          title: "Target's Omnichannel Transformation Success",
          url: "https://chainstoreage.com/targets-digital-transformation-journey-lessons-learned",
          description: "Chain Store Age analysis of Target's omnichannel transformation and organizational change management."
        }
      ]
    };

    const defaultResources = [
      {
        title: "The Science of Successful Organizational Change",
        url: "https://www.bcg.com/publications/2019/science-organizational-change",
        description: "BCG's comprehensive guide to evidence-based change management practices across industries."
      },
      {
        title: "Leading Change: Eight-Step Process for Transformation",
        url: "https://www.kotterinc.com/8-steps-process-for-leading-change/",
        description: "Kotter International's guide to the eight-step process for successful organizational transformation."
      }
    ];

    return industrySpecific[data.industry as keyof typeof industrySpecific] || defaultResources;
  };

  const getIndustryArticles = (industry: string) => {
    return industryResources[industry as keyof typeof industryResources] || [];
  };

  const fetchRelevantArticles = async (data: FormData) => {
    setIsLoadingArticles(true);
    try {
      // Generate additional case study articles (separate from AI-generated resources)
      const industryArticles = {
          Technology: [
            {
              title: "How Netflix Reinvented HR Through Organizational Change",
              url: "https://www.fastcompany.com/40540016/how-netflix-reinvented-hr",
              snippet: "Fast Company explores Netflix's revolutionary approach to talent management and organizational culture transformation.",
              source: "Fast Company"
            },
            {
              title: "Google's Project Aristotle: Building Perfect Teams Through Change",
              url: "https://rework.withgoogle.com/blog/five-keys-to-a-successful-google-team/",
              snippet: "Google's re:Work blog shares insights from Project Aristotle on team effectiveness and organizational change.",
              source: "Google re:Work"
            }
          ],
          Healthcare: [
            {
              title: "Virginia Mason's Lean Transformation in Healthcare",
              url: "https://www.healthleadersmedia.com/operations/virginia-mason-lean-transformation-case-study",
              snippet: "Health Leaders Media case study on Virginia Mason's lean transformation in healthcare delivery.",
              source: "Health Leaders Media"
            },
            {
              title: "Intermountain Healthcare's Data-Driven Transformation",
              url: "https://www.modernhealthcare.com/technology/intermountain-healthcare-data-driven-transformation",
              snippet: "Modern Healthcare examines how Intermountain Healthcare used systematic change management to improve patient outcomes.",
              source: "Modern Healthcare"
            }
          ],
          Finance: [
            {
              title: "ING Bank's Agile Transformation Journey",
              url: "https://www.forbes.com/sites/stevedenning/2021/01/15/how-ing-bank-transformed-into-an-agile-organization/",
              snippet: "Forbes examines ING's radical organizational restructuring and agile transformation journey.",
              source: "Forbes"
            },
            {
              title: "DBS Bank's Digital Transformation Success Story",
              url: "https://www.finextra.com/newsarticle/35689/dbs-digital-transformation-case-study",
              snippet: "Finextra case study of DBS Bank's comprehensive digital transformation and cultural change initiative.",
              source: "Finextra"
            }
          ],
          Retail: [
            {
              title: "Zara's Supply Chain Innovation and Organizational Agility",
              url: "https://www.supplychainbrain.com/articles/29207-zaras-supply-chain-innovation-strategy",
              snippet: "Supply Chain Brain analysis of Zara's revolutionary supply chain transformation and organizational agility.",
              source: "Supply Chain Brain"
            },
            {
              title: "Best Buy's Digital Transformation Success",
              url: "https://www.retaildive.com/news/best-buys-digital-transformation-strategy/558342/",
              snippet: "Retail Dive examines how Best Buy's CEO led a comprehensive transformation to compete in the digital landscape.",
              source: "Retail Dive"
            }
          ]
        };

        const urgencyArticles = {
          high: [
            {
              title: "Crisis Management: Leading Through Rapid Change",
              url: "https://www.bcg.com/publications/2019/science-organizational-change",
              snippet: "BCG's guide to managing rapid organizational change during crisis situations.",
              source: "BCG"
            }
          ],
          medium: [
            {
              title: "Systematic Approach to Organizational Transformation",
              url: "https://www.strategy-business.com/article/The-Secrets-of-Successful-Strategy-Execution",
              snippet: "Strategy+Business research on best practices for structured organizational change management.",
              source: "Strategy+Business"
            }
          ],
          low: [
            {
              title: "Building Sustainable Change: Long-term Transformation",
              url: "https://www.bcg.com/publications/2019/science-organizational-change",
              snippet: "BCG on sustainable approaches to long-term organizational transformation.",
              source: "BCG"
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
          url: "https://www.kotterinc.com/8-steps-process-for-leading-change/",
          snippet: "Kotter International's foundational framework for successful organizational change, based on decades of research and real-world applications.",
          source: "Kotter International"
        }
      ].slice(0, 3);
      setArticles(mockArticles);
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
            <h1 className="text-4xl font-bold text-foreground mb-4">
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
                <CardTitle className="text-primary">Strategy Summary</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center min-h-[120px]">
                <p className="leading-relaxed">{recommendation.summary}</p>
              </CardContent>
            </Card>

            {/* Immediate Action Plan */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-primary">Immediate Action Plan</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center min-h-[120px]">
                <div className="prose prose-sm max-w-none w-full">
                  <div className="whitespace-pre-line leading-relaxed">{recommendation.immediateActionPlan}</div>
                </div>
              </CardContent>
            </Card>

            {/* Stakeholder Focus */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-primary">Stakeholder Focus</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center min-h-[120px]">
                <div className="leading-relaxed">
  {typeof recommendation.stakeholderFocus === 'object' && !Array.isArray(recommendation.stakeholderFocus) ? (
    // Handle new object format with keys like {Leadership, Customers}
    <div className="space-y-4">
      {Object.entries(recommendation.stakeholderFocus).map(([stakeholder, description], index) => (
        <div key={index} className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
          <h4 className="font-semibold text-primary mb-2">{stakeholder}</h4>
          <p className="text-sm">{String(description)}</p>
        </div>
      ))}
    </div>
  ) : Array.isArray(recommendation.stakeholderFocus) ? (
    // Handle array format
    <div className="space-y-3">
      {recommendation.stakeholderFocus.map((focus: string, index: number) => (
        <div key={index} className="p-3 bg-muted/30 rounded-lg">
          <p>{focus}</p>
        </div>
      ))}
    </div>
  ) : (
    // Handle string format (fallback)
    <p>{recommendation.stakeholderFocus}</p>
  )}
</div>
              </CardContent>
            </Card>

            {/* Training Level */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-primary">Training Level</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center min-h-[120px]">
                <p className="leading-relaxed">{recommendation.trainingLevel}</p>
              </CardContent>
            </Card>

            {/* Communication Frequency */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-primary">Communication Frequency</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center min-h-[120px]">
                <div className="leading-relaxed">
  {typeof recommendation.communicationFrequency === 'object' && !Array.isArray(recommendation.communicationFrequency) ? (
    // Handle new object format with keys like {Initial Announcement, Weekly Updates, Feedback Sessions}
    <div className="space-y-4">
      {Object.entries(recommendation.communicationFrequency).map(([phase, description], index) => (
        <div key={index} className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
          <h4 className="font-semibold text-primary mb-2">{phase}</h4>
          <p className="text-sm">{String(description)}</p>
        </div>
      ))}
    </div>
  ) : (
    // Handle string format (fallback)
    <p className="leading-relaxed">{recommendation.communicationFrequency}</p>
  )}
</div>
              </CardContent>
            </Card>

            {/* Recommended Frameworks */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-primary">Recommended Frameworks</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center min-h-[120px]">
                <div className="prose prose-sm max-w-none text-foreground">
                  {Array.isArray(recommendation.recommendedFrameworks) ? (
                    recommendation.recommendedFrameworks.map((framework: any, index: number) => (
                      <div key={index} className="mb-2">
                        {typeof framework === 'string' && framework.includes('**') ? (
                          <div dangerouslySetInnerHTML={{ 
                            __html: framework
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary/80 underline">$1</a>')
                          }} />
                        ) : (
                          <p>{typeof framework === 'string' ? framework : framework.name || 'Framework'}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>{recommendation.recommendedFrameworks}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Resources */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-primary">Recommended Resources</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center min-h-[120px]">
                <div className="prose prose-sm max-w-none text-foreground">
                  {Array.isArray(recommendation.recommendedResources) ? (
                    recommendation.recommendedResources.map((resource: any, index: number) => (
                      <div key={index} className="mb-2">
                        {resource.url ? (
                          <a 
                            href={resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-primary hover:text-primary/80 underline"
                          >
                            {resource.title || resource.url}
                          </a>
                        ) : (
                          <p>{typeof resource === 'string' ? resource : resource.title || 'Resource'}</p>
                        )}
                      </div>
                    ))
                  ) : typeof recommendation.recommendedResources === 'object' && !Array.isArray(recommendation.recommendedResources) ? (
                    // Handle object format with keys like {Urgency, Recommendations}
                    <div className="space-y-4">
                      {Object.entries(recommendation.recommendedResources).map(([key, value], index) => (
                        <div key={index} className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
                          <h4 className="font-semibold text-primary mb-2">{key}</h4>
                          <p className="text-sm">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  ) : typeof recommendation.recommendedResources === 'string' ? (
                    recommendation.recommendedResources.split('\n').map((line, index) => (
                      <div key={index} className="mb-2">
                        {line.includes('**') ? (
                          <div dangerouslySetInnerHTML={{ 
                            __html: line
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary/80 underline">$1</a>')
                          }} />
                        ) : (
                          line
                        )}
                      </div>
                    ))
                  ) : (
                    <p>{String(recommendation.recommendedResources)}</p>
                  )}
                </div>
              </CardContent>
            </Card>


            {/* Industry-Specific Articles */}
            {getIndustryArticles(formData.industry).length > 0 && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-primary">Recommended Articles and Resources</CardTitle>
                  <CardDescription>
                    Curated articles and resources specifically for the {formData.industry} industry
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getIndustryArticles(formData.industry).map((resource, index) => (
                      <div key={index} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm leading-tight flex-1">{resource.title}</h4>
                          <ExternalLink className="w-4 h-4 text-muted-foreground ml-2 flex-shrink-0" />
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <Badge variant="outline" className="text-xs">{formData.industry}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs p-2 h-auto"
                            onClick={() => window.open(resource.url, '_blank', 'noopener,noreferrer')}
                          >
                            Read Article
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-6">
              <Button onClick={() => window.print()} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button onClick={() => navigate('/')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
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