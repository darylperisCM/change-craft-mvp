import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, RefreshCw, ExternalLink } from 'lucide-react';
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
              <CardContent className="min-h-[120px] space-y-3">
                <p className="leading-relaxed">{String(recommendation.summary)}</p>
                {/* People-first emphasis */}
                <PeopleFirstStrip />
              </CardContent>
            </Card>

            {/* Immediate Action Plan */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-primary">Immediate Action Plan</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center min-h-[120px]">
                <div className="prose prose-sm max-w-none w-full">
                  {Array.isArray(recommendation.immediateActionPlan) ? (
                    <ol className="list-decimal list-inside space-y-4 leading-relaxed">
                      {recommendation.immediateActionPlan.map((action: string, index: number) => (
                        <li key={index} className="pl-2 mb-4 text-sm leading-relaxed">
                          {String(action).replace(/^\d+\.\s*/, '').trim()}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <div className="whitespace-pre-line leading-relaxed">{String(recommendation.immediateActionPlan)}</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stakeholder Focus */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-primary">Stakeholder Focus</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center min-h-[120px]">
                <div className="leading-relaxed w-full">
                  {typeof recommendation.stakeholderFocus === 'object' && !Array.isArray(recommendation.stakeholderFocus) ? (
                    <div className="space-y-4">
                      {Object.entries(recommendation.stakeholderFocus).map(([stakeholder, description], index) => (
                        <div key={index} className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
                          <h4 className="font-semibold text-primary mb-2">{stakeholder}</h4>
                          <p className="text-sm">{String(description)}</p>
                        </div>
                      ))}
                    </div>
                  ) : Array.isArray(recommendation.stakeholderFocus) ? (
                    <div className="space-y-3">
                      {recommendation.stakeholderFocus.map((focus: string, index: number) => (
                        <div key={index} className="p-3 bg-muted/30 rounded-lg">
                          <p>{focus}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>{String(recommendation.stakeholderFocus)}</p>
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
                <div className="leading-relaxed w-full">
                  {typeof recommendation.trainingLevel === 'object' && !Array.isArray(recommendation.trainingLevel) ? (
                    <div className="space-y-4">
                      {Object.entries(recommendation.trainingLevel).map(([category, description], index) => (
                        <div key={index} className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
                          <h4 className="font-semibold text-primary mb-2">{category}</h4>
                          <p className="text-sm">{String(description)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>{String(recommendation.trainingLevel)}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Communication Frequency */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-primary">Communication Frequency</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center min-h-[120px]">
                <div className="leading-relaxed w-full">
                  {typeof recommendation.communicationFrequency === 'object' && !Array.isArray(recommendation.communicationFrequency) ? (
                    <div className="space-y-4">
                      {Object.entries(recommendation.communicationFrequency).map(([audience, frequency], index) => (
                        <div key={index} className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
                          <h4 className="font-semibold text-primary mb-2">{audience}</h4>
                          <p className="text-sm">{String(frequency)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>{String(recommendation.communicationFrequency)}</p>
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
                <div className="prose prose-sm max-w-none text-foreground w-full">
                  {typeof recommendation.recommendedFrameworks === 'object' && !Array.isArray(recommendation.recommendedFrameworks) ? (
                    <div className="space-y-4">
                      {Object.entries(recommendation.recommendedFrameworks).map(([framework, description], index) => {
                        const websiteUrl = FRAMEWORK_WEBSITES[framework];
                        return (
                          <div key={index} className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-primary">{framework}</h4>
                              {websiteUrl && (
                                <a 
                                  href={websiteUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs text-primary hover:text-primary/80 underline"
                                >
                                  (Official Website)
                                </a>
                              )}
                            </div>
                            <p className="text-sm">{String(description)}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : Array.isArray(recommendation.recommendedFrameworks) ? (
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
                    <p>{String(recommendation.recommendedFrameworks)}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stakeholder Impact (RAG heatmap) */}
            {recommendation.stakeholderImpact && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-primary">Stakeholder Impact Matrix (Likelihood × Severity)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="p-3 rounded-xl bg-red-50 text-red-700">Red: {recommendation.stakeholderImpact.summary.reds}</div>
                    <div className="p-3 rounded-xl bg-yellow-50 text-yellow-700">Amber: {recommendation.stakeholderImpact.summary.ambers}</div>
                    <div className="p-3 rounded-xl bg-green-50 text-green-700">Green: {recommendation.stakeholderImpact.summary.greens}</div>
                  </div>
                  <HeatmapTable matrix={recommendation.stakeholderImpact.matrix} />
                </CardContent>
              </Card>
            )}

            {/* Mitigation Strategy per Stakeholder */}
            {(recommendation.stakeholderMitigations?.length ?? 0) > 0 && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-primary">Mitigation Strategy by Stakeholder</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendation.stakeholderMitigations!.map((m, i) => {
                    const rag = recommendation.stakeholderImpact?.stakeholders.find(s => s.name === m.name)?.rag;
                    return (
                      <div key={`${m.name}-${i}`} className="p-4 border rounded-xl">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{m.name}</div>
                          <RAGBadge rag={rag} />
                        </div>
                        {Array.isArray(m.mitigation) ? (
                          <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                            {m.mitigation.map((li, j) => <li key={j}>{li}</li>)}
                          </ul>
                        ) : (
                          <p className="mt-2 text-sm leading-relaxed">{m.mitigation}</p>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

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

            {/* Upgrade CTA */}
            <Card className="shadow-card">
              <CardContent className="flex items-center justify-between flex-col md:flex-row gap-4 py-6">
                <div>
                  <div className="text-lg font-semibold">Want the full Toolkit pre-filled for your change?</div>
                  <p className="text-sm text-muted-foreground">
                    Download a customized Excel with Stakeholder Map, Impact, Comms Plan, and Training Plan auto-populated from your answers.
                  </p>
                </div>
                <Button size="lg" onClick={() => navigate('/pricing')}>Upgrade & Download</Button>
              </CardContent>
            </Card>

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

/* ----------------- Small helper components ----------------- */
function PeopleFirstStrip() {
  return (
    <div className="mt-2 p-3 rounded-xl border bg-background">
      <div className="text-sm">
        <strong>People first:</strong> We’ll acknowledge uncertainty, create psychological safety, and celebrate quick wins while keeping steps realistic for small teams.
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

function HeatmapTable({ matrix }: { matrix: StakeholderResult[][][] }) {
  // Render Likelihood rows 5→1 and Severity cols 1→5
  const rows = useMemo(() => [5, 4, 3, 2, 1], []);
  const cols = useMemo(() => [1, 2, 3, 4, 5], []);

  const cellBg = (stakeholders: StakeholderResult[]) => {
    const worst = stakeholders.reduce((m, s) => Math.max(m, s.riskScore), 0);
    if (worst >= 16) return "bg-red-100";
    if (worst >= 9) return "bg-yellow-100";
    if (worst > 0) return "bg-green-100";
    return "";
  };

  return (
    <div className="overflow-auto">
      <table className="min-w-full border rounded-xl">
        <thead>
          <tr>
            <th className="p-2 text-left text-xs">Likelihood \\ Severity</th>
            {cols.map((s) => (
              <th key={s} className="p-2 text-xs font-medium">{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((l) => (
            <tr key={l}>
              <td className="p-2 text-xs font-medium">{l}</td>
              {cols.map((s) => {
                const cell = matrix[l - 1][s - 1];
                return (
                  <td key={`${l}-${s}`} className={`align-top p-2 text-xs border ${cellBg(cell)}`}>
                    {cell.length ? (
                      <ul className="space-y-1">
                        {cell.map((r) => (
                          <li key={`${r.name}-${r.riskScore}`} className="leading-snug">
                            <span className="font-medium">{r.name}</span>
                            <span className="ml-1 text-[11px] text-muted-foreground">RS:{r.riskScore}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground">–</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
