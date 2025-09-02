import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Download, RefreshCw, ExternalLink, ChevronRight, ChevronLeft } from 'lucide-react';
import { FormData } from '@/components/ChangeAssessmentForm';
import { supabase } from '@/integrations/supabase/client';

// Framework website mapping
const FRAMEWORK_WEBSITES: { [key: string]: string } = {
  "ADKAR": "https://www.prosci.com/methodology/adkar",
  "Kotter's 8-Step Process": "https://www.kotterinc.com/8-steps-process-for-leading-change/",
  "Kotter's 8-Step": "https://www.kotterinc.com/8-steps-process-for-leading-change/",
  "Lean Change Management": "https://leanchange.org/",
  "Bridge Transition Model": "https://wmbridges.com/about/what-is-transition/",
  "Bridges Transition Model": "https://wmbridges.com/about/what-is-transition/",
  "Design Thinking": "https://www.ideou.com/pages/design-thinking",
  "Agile Change Management": "https://www.agilealliance.org/agile101/",
  "McKinsey 7-S Framework": "https://www.mckinsey.com/business-functions/strategy-and-corporate-finance/our-insights/enduring-ideas-the-7-s-framework",
  "Nudge Theory": "https://www.behaviouralinsights.co.uk/publications/nudge-techniques/",
};

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
    { title: "Changes in logistics and transportation in 2025", url: "https://onturtle.eu/en/changes-in-logistics-and-transportation/" },
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

// -------- New types to support stakeholder impact & mitigations (non-breaking) --------
type RAG = "Red" | "Amber" | "Green";
const importanceByRAG: Record<RAG, string> = {
  Red:   "Critical stakeholder group — very high likelihood and severity. Needs executive sponsorship, visible support, and intensive engagement.",
  Amber: "Important stakeholder group — moderate-to-high risk. Address concerns early, clarify WIIFM, and keep engagement consistent.",
  Green: "Supportive/low-risk stakeholder group. Maintain awareness and momentum with recognition, light-touch updates, and opportunities to contribute."
};

interface StakeholderResult {
  name: string;
  severity: number;     // 1–5
  likelihood: number;   // 1–5
  riskScore: number;    // 1–25
  rag: RAG;
  notes?: string;
}

interface StakeholderImpact {
  stakeholders: StakeholderResult[];
  matrix: StakeholderResult[][][]; // [likelihood-1][severity-1]
  summary: { reds: number; ambers: number; greens: number; highestRisk: StakeholderResult[] };
}

interface StrategyRecommendation {
  // keep your existing fields but allow object/array too (your renderers already handle these shapes)
  summary: string | any;
  immediateActionPlan: string | string[] | any;
  stakeholderFocus: string | string[] | Record<string, string>;
  trainingLevel: string | Record<string, string>;
  communicationFrequency: string | Record<string, string>;
  recommendedFrameworks: string | any[] | Record<string, string>;
  recommendedResources: string | any;

  // NEW optional fields from backend (rendered conditionally)
  stakeholderImpact?: StakeholderImpact;
  stakeholderMitigations?: { name: string; mitigation: string[] | string }[];
  humanElements?: {
    likelyEmotions?: string[];
    resistancePatterns?: string[];
    managerTalkingPoints?: string[];
    motivationBoosters?: string[];
    inclusionAccessibility?: string[];
  };
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
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 'summary', title: 'Strategy Summary & Stakeholder Focus', shortTitle: 'Summary' },
    { id: 'action', title: 'Immediate Action Plan & Recommended Frameworks', shortTitle: 'Action Plan' },
    { id: 'training', title: 'Training Level & Communication Frequency', shortTitle: 'Training' },
    { id: 'matrix', title: 'Stakeholder Impact Matrix', shortTitle: 'Impact Matrix' },
    { id: 'mitigation', title: 'Mitigation Strategy & Upgrade CTA', shortTitle: 'Mitigation' }
  ];

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

      if (!response || typeof response !== 'object') {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response format from generate-strategy function');
      }

      const requiredFields = ['summary', 'immediateActionPlan', 'stakeholderFocus', 'trainingLevel', 'communicationFrequency', 'recommendedFrameworks', 'recommendedResources'];
      const missingFields = requiredFields.filter(field => !response[field]);
      if (missingFields.length > 0) {
        console.error('Response missing required fields:', missingFields);
        throw new Error(`Response missing required fields: ${missingFields.join(', ')}`);
      }

      console.log('✅ SUCCESS: Using AI-generated response');
      setRecommendation(response as StrategyRecommendation);

      if (email && response) {
        try {
          await supabase.functions.invoke('send-strategy-email', {
            body: { email, strategyData: response, assessmentData: data }
          });
        } catch (emailError) {
          console.error('Failed to send email:', emailError);
        }
      }
    } catch (error) {
      console.error('❌ FALLBACK: Using hardcoded template responses due to error:', error);

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

      if (email && mockRecommendation) {
        try {
          await supabase.functions.invoke('send-strategy-email', {
            body: { email, strategyData: mockRecommendation, assessmentData: data }
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
    const urgencyMap: any = {
      high: 'rapid deployment',
      medium: 'structured phased approach',
      low: 'comprehensive long-term strategy'
    };
    const sizeMap: any = {
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
    const frequencyMap: any = {
      high: 'Daily updates during implementation, weekly town halls, and bi-weekly leadership briefings',
      medium: 'Bi-weekly updates, monthly all-hands meetings, and quarterly stakeholder reviews',
      low: 'Weekly updates, monthly progress reports, and quarterly milestone celebrations'
    };
    return frequencyMap[data.urgency] + '. Utilize multiple channels including email, intranet, team meetings, and dedicated change champion networks to ensure consistent messaging across all stakeholder groups.';
  };

  const generateFrameworks = (data: FormData): string[] => {
    const frameworks = ['ADKAR (Awareness, Desire, Knowledge, Ability, Reinforcement)'];
    if (data.organizationSize === 'large') frameworks.push('Kotter\'s 8-Step Process');
    if (data.changeTypes.includes('Technology') || data.changeTypes.includes('Platform')) frameworks.push('Lean Change Management');
    if (data.changeTypes.includes('Culture')) frameworks.push('Bridge Transition Model');
    if (data.urgency === 'high') frameworks.push('Agile Change Management');
    if (data.stakeholderGroups.includes('Customers')) frameworks.push('Design Thinking for Change');
    return frameworks;
  };

  const generateRecommendedResources = (data: FormData): string => {
    const resources: string[] = [];
    if (data.industry === "Information Technology") {
      resources.push("**Digital Transformation Playbook** - BCG's comprehensive guide for tech companies: https://www.bcg.com/publications/2020/accelerating-digital-transformation");
    } else if (data.industry === "Healthcare") {
      resources.push("**Healthcare Change Management Guide** - Specialized resources for healthcare transformations: https://www.healthleadersmedia.com/innovation/mayo-clinic-shares-lessons-learned-transformation-patient-centered-care");
    } else if (data.industry === "Financial Services") {
      resources.push("**Financial Services Change Toolkit** - Regulatory-compliant change management for financial organizations: https://www.edstellar.com/blog/change-management-in-financial-services");
    } else {
      resources.push("**Industry Change Management Best Practices** - Comprehensive change management strategies: https://www.prosci.com/blog/change-management-best-practices");
    }
    resources.push("**Harvard Business Review Change Management Collection** - Evidence-based articles and case studies: https://hbr.org/topic/change-management");
    resources.push("**Kotter International Resources** - Free tools and assessments for organizational change: https://www.kotterinc.com/resources/");
    return resources.join("\n\n");
  };

  const generateActionPlan = (data: FormData): string => {
    const urgencyActions: any = {
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
    const industrySpecific: any = {
      Technology: [
        { title: "How Netflix Reinvented HR Through Organizational Change", url: "https://medium.com/@cultureamp/how-netflix-reinvented-hr-a-culture-transformation-story-8a1d7b8e9c45", description: "Medium article exploring Netflix's revolutionary approach to talent management and organizational culture transformation." },
        { title: "Microsoft's Growth Mindset: A Cultural Transformation", url: "https://www.linkedin.com/pulse/how-microsoft-transformed-its-culture-satya-nadella-growth-mindset", description: "LinkedIn article on Microsoft's cultural and technological transformation under Satya Nadella's leadership." }
      ],
      Healthcare: [
        { title: "Mayo Clinic's Patient-Centered Care Transformation", url: "https://www.healthleadersmedia.com/innovation/mayo-clinic-shares-lessons-learned-transformation-patient-centered-care", description: "Health Leaders Media examines Mayo Clinic's patient-centered care transformation and change management strategies." },
        { title: "Cleveland Clinic's Cultural Transformation Journey", url: "https://www.modernhealthcare.com/operations/cleveland-clinic-culture-change-patient-experience", description: "Modern Healthcare case study on Cleveland Clinic's systematic approach to cultural change in healthcare." }
      ],
      Finance: [
        { title: "DBS Bank's Digital Transformation Success", url: "https://www.finextra.com/newsarticle/38245/dbs-bank-digital-transformation-journey-case-study", description: "Finextra analysis of DBS Bank's comprehensive digital transformation and change management approach." },
        { title: "ING's Agile Transformation: Banking Revolution", url: "https://www.forbes.com/sites/stephentaub/2021/03/15/how-ing-bank-transformed-into-an-agile-organization/", description: "Forbes insights on ING's radical organizational restructuring and agile transformation journey." }
      ],
      Retail: [
        { title: "Walmart's Digital Commerce Transformation", url: "https://www.digitalcommerce360.com/2020/06/15/walmart-ecommerce-transformation-strategy/", description: "Digital Commerce 360 case study on Walmart's strategic transformation to compete in the digital marketplace." },
        { title: "Target's Omnichannel Transformation Success", url: "https://chainstoreage.com/targets-digital-transformation-journey-lessons-learned", description: "Chain Store Age analysis of Target's omnichannel transformation and organizational change management." }
      ]
    };
    const defaultResources = [
      { title: "The Science of Successful Organizational Change", url: "https://www.bcg.com/publications/2019/science-organizational-change", description: "BCG's comprehensive guide to evidence-based change management practices across industries." },
      { title: "Leading Change: Eight-Step Process for Transformation", url: "https://www.kotterinc.com/8-steps-process-for-leading-change/", description: "Kotter International's guide to the eight-step process for successful organizational transformation." }
    ];
    return industrySpecific[(data.industry as any)] || defaultResources;
  };

  const getIndustryArticles = (industry: string) => {
    return (industryResources as any)[industry] || [];
  };

  const fetchRelevantArticles = async (data: FormData) => {
    setIsLoadingArticles(true);
    try {
      // Placeholder for future dynamic fetch – currently using curated lists above.
      const industrySpecific: any = []; 
      const urgencySpecific: any = [];
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

  const handleDownload = () => {
    window.print();
  };

  const handleNewAssessment = () => {
    sessionStorage.removeItem('changeAssessmentData');
    sessionStorage.removeItem('userEmail');
    navigate('/');
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  if (!formData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/assessment')}
              className="flex items-center gap-2 text-primary hover:text-primary/80"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Assessment
            </Button>
          </div>
        </div>

        {/* Assessment Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">Your Change Management Strategy</CardTitle>
            <CardDescription className="text-lg">
              Personalized recommendations based on your assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="font-semibold text-muted-foreground">Organization Size</p>
                <p className="text-lg capitalize">{formData.organizationSize}</p>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground">Industry</p>
                <p className="text-lg">{formData.industry}</p>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground">Change Types</p>
                <p className="text-lg">{formData.changeTypes.join(', ')}</p>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground">Urgency</p>
                <Badge variant={formData.urgency === 'high' ? 'destructive' : formData.urgency === 'medium' ? 'default' : 'secondary'} className="text-sm">
                  {formData.urgency}
                </Badge>
              </div>
            </div>
            <div className="pt-2">
              <p className="font-semibold text-muted-foreground">Stakeholder Groups ({formData.stakeholderGroups.length})</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.stakeholderGroups.map((group, index) => (
                  <Badge key={index} variant="outline" className="text-sm">{group}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strategy Loading State */}
        {isLoading && (
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg font-medium">Generating your personalized strategy...</p>
              <p className="text-muted-foreground">This may take a few moments</p>
            </CardContent>
          </Card>
        )}

        {/* Strategy Results with Stepper */}
        {recommendation && !isLoading && (
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Desktop: Left Navigation */}
            <div className="hidden lg:block lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="text-lg">Strategy Steps</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    {steps.map((step, index) => (
                      <button
                        key={step.id}
                        onClick={() => goToStep(index)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          currentStep === index
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            currentStep === index
                              ? 'bg-primary-foreground text-primary'
                              : 'bg-muted-foreground/20'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium">{step.shortTitle}</span>
                        </div>
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Mobile: Top Tabs */}
            <div className="lg:hidden mb-6">
              <Tabs value={currentStep.toString()} onValueChange={(value) => setCurrentStep(parseInt(value))}>
                <TabsList className="w-full grid grid-cols-5">
                  {steps.map((step, index) => (
                    <TabsTrigger key={step.id} value={index.toString()} className="text-xs">
                      {index + 1}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Step Content */}
              <div className="space-y-6">
                {/* Step 1: Strategy Summary & Stakeholder Focus */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-primary">{steps[0].title}</h2>
                      <span className="text-sm text-muted-foreground">Step 1 of 5</span>
                    </div>
                    
                    <PeopleFirstStrip />
                    
                    <Card className="shadow-card">
                      <CardHeader>
                        <CardTitle className="text-primary">
                          Strategy Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {typeof recommendation.summary === 'string' ? (
                          <p className="text-lg leading-relaxed">{recommendation.summary}</p>
                        ) : (
                          <div className="space-y-4">
                            {recommendation.summary?.overview && (
                              <div>
                                <h4 className="font-semibold text-primary mb-2">Overview</h4>
                                <p className="leading-relaxed">{recommendation.summary.overview}</p>
                              </div>
                            )}
                            {recommendation.summary?.keyPriorities && (
                              <div>
                                <h4 className="font-semibold text-primary mb-2">Key Priorities</h4>
                                <ul className="list-disc pl-6 space-y-1">
                                  {recommendation.summary.keyPriorities.map((priority: string, idx: number) => (
                                    <li key={idx}>{priority}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {recommendation.summary?.successFactors && (
                              <div>
                                <h4 className="font-semibold text-primary mb-2">Success Factors</h4>
                                <ul className="list-disc pl-6 space-y-1">
                                  {recommendation.summary.successFactors.map((factor: string, idx: number) => (
                                    <li key={idx}>{factor}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="shadow-card">
                      <CardHeader>
                        <CardTitle className="text-primary">
                          Stakeholder Focus
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {typeof recommendation.stakeholderFocus === 'string' ? (
                          <p className="text-lg leading-relaxed">{recommendation.stakeholderFocus}</p>
                        ) : Array.isArray(recommendation.stakeholderFocus) ? (
                          <ul className="space-y-2">
                            {recommendation.stakeholderFocus.map((focus: string, index: number) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>{focus}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="space-y-4">
                            {Object.entries(recommendation.stakeholderFocus || {}).map(([group, focus]: [string, any]) => (
                              <div key={group} className="border-l-4 border-primary pl-4">
                                <h4 className="font-semibold text-primary mb-1">{group}</h4>
                                <p className="text-muted-foreground">{focus}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Step 2: Immediate Action Plan & Recommended Frameworks */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-primary">{steps[1].title}</h2>
                      <span className="text-sm text-muted-foreground">Step 2 of 5</span>
                    </div>
                    
                    <Card className="shadow-card">
                      <CardHeader>
                        <CardTitle className="text-primary">
                          Immediate Action Plan
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {Array.isArray(recommendation.immediateActionPlan) ? (
                          <ul className="space-y-3">
                            {recommendation.immediateActionPlan.map((action: string, index: number) => (
                              <li key={index} className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                                  {index + 1}
                                </span>
                                <span className="leading-relaxed">{action}</span>
                              </li>
                            ))}
                          </ul>
                        ) : typeof recommendation.immediateActionPlan === 'string' ? (
                          <div className="prose max-w-none">
                            {recommendation.immediateActionPlan.split('\n').map((line: string, index: number) => (
                              <p key={index} className="leading-relaxed">{line}</p>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {Object.entries(recommendation.immediateActionPlan || {}).map(([phase, actions]: [string, any]) => (
                              <div key={phase}>
                                <h4 className="font-semibold text-primary mb-2 capitalize">{phase.replace(/([A-Z])/g, ' $1').trim()}</h4>
                                {Array.isArray(actions) ? (
                                  <ul className="list-disc pl-6 space-y-1">
                                    {actions.map((action: string, idx: number) => (
                                      <li key={idx}>{action}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p>{actions}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="shadow-card">
                      <CardHeader>
                        <CardTitle className="text-primary">
                          Recommended Frameworks
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {typeof recommendation.recommendedFrameworks === 'string' ? (
                          <div className="space-y-3">
                            {recommendation.recommendedFrameworks.split(',').map((framework: string, index: number) => {
                              const trimmedFramework = framework.trim();
                              const websiteUrl = FRAMEWORK_WEBSITES[trimmedFramework];
                              return (
                                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                  <span className="font-medium">{trimmedFramework}</span>
                                  {websiteUrl && (
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      asChild
                                      className="text-primary hover:text-primary/80"
                                    >
                                      <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                        Learn More <ExternalLink className="w-3 h-3" />
                                      </a>
                                    </Button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : Array.isArray(recommendation.recommendedFrameworks) ? (
                          <div className="space-y-3">
                            {recommendation.recommendedFrameworks.map((framework: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <div>
                                  <span className="font-medium">{typeof framework === 'string' ? framework : framework.name}</span>
                                  {typeof framework === 'object' && framework.description && (
                                    <p className="text-sm text-muted-foreground mt-1">{framework.description}</p>
                                  )}
                                </div>
                                {((typeof framework === 'string' && FRAMEWORK_WEBSITES[framework]) || 
                                  (typeof framework === 'object' && framework.url)) && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    asChild
                                    className="text-primary hover:text-primary/80"
                                  >
                                    <a 
                                      href={typeof framework === 'string' ? FRAMEWORK_WEBSITES[framework] : framework.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="flex items-center gap-1"
                                    >
                                      Learn More <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {Object.entries(recommendation.recommendedFrameworks || {}).map(([category, frameworks]: [string, any]) => (
                              <div key={category}>
                                <h4 className="font-semibold text-primary mb-2 capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</h4>
                                <div className="space-y-2 pl-4">
                                  {Array.isArray(frameworks) ? (
                                    frameworks.map((framework: string, idx: number) => (
                                      <div key={idx} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                                        <span>{framework}</span>
                                        {FRAMEWORK_WEBSITES[framework] && (
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            asChild
                                            className="text-primary hover:text-primary/80"
                                          >
                                            <a href={FRAMEWORK_WEBSITES[framework]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                              Learn More <ExternalLink className="w-3 h-3" />
                                            </a>
                                          </Button>
                                        )}
                                      </div>
                                    ))
                                  ) : (
                                    <p>{frameworks}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Step 3: Training Level & Communication Frequency */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-primary">{steps[2].title}</h2>
                      <span className="text-sm text-muted-foreground">Step 3 of 5</span>
                    </div>
                    
                    <Card className="shadow-card">
                      <CardHeader>
                        <CardTitle className="text-primary">
                          Training Level
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {typeof recommendation.trainingLevel === 'string' ? (
                          <p className="text-lg leading-relaxed">{recommendation.trainingLevel}</p>
                        ) : (
                          <div className="space-y-4">
                            {Object.entries(recommendation.trainingLevel || {}).map(([level, description]: [string, any]) => (
                              <div key={level} className="border rounded-lg p-4 bg-muted/30">
                                <h4 className="font-semibold text-primary mb-2 capitalize">{level.replace(/([A-Z])/g, ' $1').trim()}</h4>
                                <p className="text-muted-foreground">{description}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="shadow-card">
                      <CardHeader>
                        <CardTitle className="text-primary">
                          Communication Frequency
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {typeof recommendation.communicationFrequency === 'string' ? (
                          <p className="text-lg leading-relaxed">{recommendation.communicationFrequency}</p>
                        ) : (
                          <div className="space-y-4">
                            {Object.entries(recommendation.communicationFrequency || {}).map(([frequency, details]: [string, any]) => (
                              <div key={frequency} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                                <div className="flex-shrink-0">
                                  <Badge variant="outline" className="font-medium">{frequency}</Badge>
                                </div>
                                <p className="text-muted-foreground">{details}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Step 4: Stakeholder Impact Matrix */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-primary">{steps[3].title}</h2>
                      <span className="text-sm text-muted-foreground">Step 4 of 5</span>
                    </div>
                    
                    {recommendation.stakeholderImpact ? (
                      <Card className="shadow-card">
                        <CardHeader>
                          <CardTitle className="text-primary">
                            Stakeholder Impact Matrix
                          </CardTitle>
                          <CardDescription>
                            Likelihood × Severity heatmap showing stakeholder risk levels
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* RAG Summary */}
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                              <RAGBadge rag="Red" />
                              <span className="text-sm font-medium">{recommendation.stakeholderImpact.summary.reds} Critical</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <RAGBadge rag="Amber" />
                              <span className="text-sm font-medium">{recommendation.stakeholderImpact.summary.ambers} Important</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <RAGBadge rag="Green" />
                              <span className="text-sm font-medium">{recommendation.stakeholderImpact.summary.greens} Supportive</span>
                            </div>
                          </div>

                          {/* Heatmap */}
                          <div className="overflow-x-auto">
                            <HeatmapTable matrix={recommendation.stakeholderImpact.matrix} />
                          </div>

                          {/* Highest Risk Stakeholders */}
                          {recommendation.stakeholderImpact.summary.highestRisk.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-primary mb-3">Highest Risk Stakeholders</h4>
                              <div className="space-y-2">
                                {recommendation.stakeholderImpact.summary.highestRisk.map((stakeholder, index) => (
                                  <div key={index} className="flex items-center justify-between p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <RAGBadge rag={stakeholder.rag} />
                                      <span className="font-medium">{stakeholder.name}</span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      Risk Score: {stakeholder.riskScore}/25
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="shadow-card">
                        <CardContent className="p-8 text-center">
                          <div className="text-6xl mb-4">📊</div>
                          <h3 className="text-xl font-semibold mb-2">Stakeholder Impact Analysis</h3>
                          <p className="text-muted-foreground mb-4">
                            Detailed stakeholder impact matrix is available in the premium version of this report.
                          </p>
                          <Button variant="outline">
                            Upgrade to See Full Analysis
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Step 5: Mitigation Strategy & Upgrade CTA */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-primary">{steps[4].title}</h2>
                      <span className="text-sm text-muted-foreground">Step 5 of 5</span>
                    </div>
                    
                    {recommendation.stakeholderMitigations && recommendation.stakeholderMitigations.length > 0 ? (
                      <Card className="shadow-card">
                        <CardHeader>
                          <CardTitle className="text-primary">
                            Mitigation Strategy by Stakeholder
                          </CardTitle>
                          <CardDescription>
                            Targeted strategies to address stakeholder-specific risks and concerns
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {recommendation.stakeholderMitigations.map((stakeholder, index) => {
                            // Find RAG rating for importance line
                            const stakeholderData = recommendation.stakeholderImpact?.stakeholders.find(s => s.name === stakeholder.name);
                            const rag = stakeholderData?.rag;
                            
                            return (
                              <div key={index} className="border rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-3">
                                  {rag && <RAGBadge rag={rag} />}
                                  <h4 className="font-semibold text-lg">{stakeholder.name}</h4>
                                  {rag && (
                                    <div className="text-sm text-muted-foreground">
                                      {importanceByRAG[rag]}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="pl-6">
                                  {Array.isArray(stakeholder.mitigation) ? (
                                    <ul className="space-y-2">
                                      {stakeholder.mitigation.map((action: string, actionIndex: number) => (
                                        <li key={actionIndex} className="flex items-start gap-2">
                                          <span className="text-primary text-sm mt-1">•</span>
                                          <span className="text-sm">{action}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-sm">{stakeholder.mitigation}</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="shadow-card">
                        <CardContent className="p-8 text-center">
                          <div className="text-6xl mb-4">🛡️</div>
                          <h3 className="text-xl font-semibold mb-2">Stakeholder Mitigation Strategies</h3>
                          <p className="text-muted-foreground mb-4">
                            Detailed mitigation strategies for each stakeholder group are available in the premium version.
                          </p>
                          <Button variant="outline">
                            Upgrade to See Full Strategies
                          </Button>
                        </CardContent>
                      </Card>
                    )}

                    <Card className="shadow-card border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent">
                      <CardHeader>
                        <CardTitle className="text-primary flex items-center gap-2">
                          <span className="text-2xl">⭐</span>
                          Upgrade to Full Toolkit
                        </CardTitle>
                        <CardDescription>
                          Get access to detailed templates, worksheets, and implementation guides
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h4 className="font-semibold">What's Included:</h4>
                            <ul className="text-sm space-y-1 text-muted-foreground">
                              <li>• Detailed implementation templates</li>
                              <li>• Stakeholder communication scripts</li>
                              <li>• Training curriculum outlines</li>
                              <li>• Progress tracking worksheets</li>
                              <li>• Change readiness assessments</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-semibold">Premium Features:</h4>
                            <ul className="text-sm space-y-1 text-muted-foreground">
                              <li>• Customizable PowerPoint presentations</li>
                              <li>• Executive briefing templates</li>
                              <li>• Risk mitigation playbooks</li>
                              <li>• Success metrics dashboards</li>
                              <li>• 1-on-1 consultation call</li>
                            </ul>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                          <Button size="lg" className="flex-1">
                            Upgrade Now - $97
                          </Button>
                          <Button variant="outline" size="lg" onClick={handleDownload} className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Download Current Report
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Final Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                      <Button 
                        onClick={handleDownload}
                        size="lg" 
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download as PDF
                      </Button>
                      <Button 
                        onClick={handleNewAssessment}
                        size="lg"
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Start New Assessment
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Step Navigation */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToStep(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        currentStep === index
                          ? 'bg-primary'
                          : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={nextStep}
                  disabled={currentStep === steps.length - 1}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Articles and Resources */}
        {articles.length > 0 && (
          <Card className="mt-8 shadow-card">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <span className="text-2xl">📖</span>
                Recommended Articles and Resources
              </CardTitle>
              <CardDescription>
                Industry-specific articles and resources to support your change management journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingArticles ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mr-3"></div>
                  <span>Loading relevant articles...</span>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {articles.map((article, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h4 className="font-semibold mb-2 line-clamp-2">{article.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{article.snippet}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{article.source}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          asChild
                          className="text-primary hover:text-primary/80"
                        >
                          <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                            Read More <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Results;

/* ----------------- Small helper components ----------------- */
function PeopleFirstStrip() {
  return (
    <div className="mt-2 p-3 rounded-xl border bg-background">
      <div className="text-sm">
        <strong>People first:</strong> We'll acknowledge uncertainty, create psychological safety, and celebrate quick wins while keeping steps realistic for small teams.
      </div>
    </div>
  );
}

function RAGBadge({ rag }: { rag?: RAG }) {
  if (!rag) return null;
  const cls =
    rag === "Red"
      ? "bg-red-100 text-red-700"
      : rag === "Amber"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";
  return <span className={`px-2 py-1 rounded-full text-xs ${cls}`}>{rag}</span>;
}

/* === Pretty, tile-style heatmap (Likelihood × Severity) === */
function PrettyHeatmap({ matrix }: { matrix: StakeholderResult[][][] }) {
  const likelihoodLabels = ["Never", "Rarely", "Sometimes", "Often", "Always"]; // 1..5
  const severityLabels   = ["Very Light", "Light", "Medium", "Heavy", "Very Heavy"]; // 1..5

  const tileColor = (value: number) => {
    if (value >= 20) return "bg-red-500";
    if (value >= 16) return "bg-red-400";
    if (value >= 12) return "bg-amber-400";
    if (value >= 8)  return "bg-yellow-300";
    if (value >= 5)  return "bg-lime-300";
    if (value >= 3)  return "bg-green-400";
    if (value >= 2)  return "bg-green-600";
    return "bg-green-700";
  };

  const rows = [5, 4, 3, 2, 1]; // Likelihood high→low
  const cols = [1, 2, 3, 4, 5]; // Severity low→high

  return (
    <div className="w-full">
      <div className="max-w-full">
        {/* Severity (X-axis) */}
        <div className="grid grid-cols-[80px_repeat(5,minmax(0,1fr))] gap-1 items-center mb-2">
          <div />
          {cols.map((s) => (
            <div key={s} className="text-center text-[10px] font-medium text-muted-foreground">
              {severityLabels[s-1]}
            </div>
          ))}
        </div>

        {/* Matrix grid */}
        <div className="grid gap-1">
          {rows.map((l) => (
            <div key={l} className="grid grid-cols-[80px_repeat(5,minmax(0,1fr))] gap-1">
              {/* Likelihood label */}
              <div className="flex items-center justify-end pr-1 text-[10px] font-medium text-muted-foreground">
                {likelihoodLabels[l-1]}
              </div>

              {cols.map((s) => {
                const cell = matrix[l-1][s-1];
                const value = s * l; // Severity × Likelihood
                return (
                  <div
                    key={`${l}-${s}`}
                    className={`relative h-12 rounded ${tileColor(value)} shadow-sm`}
                  >
                    {cell.length > 0 && (
  <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
    <div
      className={`
        text-base md:text-lg font-bold leading-snug whitespace-pre-line drop-shadow-sm
        ${value >= 8 && value <= 12 ? "text-black" : "text-white"}
      `}
    >
      {cell.map(r => r.name).join("\n")}
    </div>
  </div>
)}

                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Axis labels */}
        <div className="mt-2 grid grid-cols-[80px_repeat(5,minmax(0,1fr))]">
          <div />
          <div className="col-span-5 text-center text-[10px] text-muted-foreground">Severity</div>
        </div>
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6">
          <div className="-rotate-90 text-[10px] text-muted-foreground whitespace-nowrap">
            Likelihood
          </div>
        </div>
      </div>
    </div>
  );
}

/* Alias to avoid crashes if any JSX still uses <HeatmapTable /> */
const HeatmapTable = PrettyHeatmap;
