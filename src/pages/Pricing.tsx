import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Star } from "lucide-react";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      title: "Start for Free",
      price: "$0",
      description: "Generate your personalized Change Management plan — free forever.",
      features: [
        "Access to planner",
        "Email delivery of your custom plan",
        "Basic recommendations"
      ],
      cta: "Start Assessment",
      ctaAction: () => navigate('/assessment'),
      popular: false
    },
    {
      title: "Basic Toolkit",
      price: "$49",
      priceNote: "one-time",
      description: "Access a set of generic templates and tools — ready to download and fully editable for your organization.",
      features: [
        "Instant access to templates",
        "Editable stakeholder map, comms plan, trackers",
        "PPT + Excel files",
        "Step-by-step instructions"
      ],
      cta: "Get the Toolkit",
      ctaAction: () => window.open('mailto:darylperis.cm@gmail.com?subject=Basic Toolkit Purchase Inquiry'),
      popular: false
    },
    {
      title: "Customized Toolkit",
      price: "$79",
      priceNote: "one-time",
      description: "Receive templates and tools tailored to your inputs, organization specifics, and change type.",
      features: [
        "Templates customized for your needs",
        "Editable stakeholder map, comms plan, trackers",
        "PPT + Excel files",
        "Personalized implementation guide",
        "Email delivery within 48 hours"
      ],
      cta: "Get Customized Toolkit",
      ctaAction: () => window.open('mailto:darylperis.cm@gmail.com?subject=Customized Toolkit Purchase Inquiry'),
      popular: true
    },
    {
      title: "Change Success Kit",
      price: "$139",
      priceNote: "one-time",
      description: "Get a 60-minute live session with a certified expert plus your customized toolkit—everything you need to succeed.",
      features: [
        "60-minute live expert session",
        "Fully customized templates and tools",
        "Personalized action plan",
        "Follow-up resources",
        "Priority email support"
      ],
      cta: "Get Expert Bundle",
      ctaAction: () => window.open('mailto:darylperis.cm@gmail.com?subject=Change Success Kit Purchase Inquiry'),
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-primary">Change Craft</h1>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="/" className="text-foreground/80 hover:text-primary transition-colors">Home</a>
              <a href="/learn" className="text-foreground/80 hover:text-primary transition-colors">Learn More</a>
              <a href="/assessment" className="text-foreground/80 hover:text-primary transition-colors">Start Assessment</a>
              <a href="/pricing" className="text-primary font-semibold">Pricing</a>
              <a href="/about" className="text-foreground/80 hover:text-primary transition-colors">About Us</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Pricing</h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            Free to get started. Pay only if you need advanced tools or expert guidance.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative flex-1 flex flex-col transition-all duration-300 hover:shadow-xl rounded-xl shadow-md ${
                plan.popular ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'hover:shadow-lg'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center p-8 pb-4">
                <CardTitle className="text-xl font-semibold">{plan.title}</CardTitle>
                <div className="flex items-baseline justify-center gap-1 my-4">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  {plan.priceNote && (
                    <span className="text-foreground/60 text-lg">{plan.priceNote}</span>
                  )}
                </div>
                <CardDescription className="text-center text-foreground/70 leading-relaxed">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-8 pt-4">
                <ul className="space-y-4 flex-1">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3 text-center">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground/80 text-left">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <Button 
                    onClick={plan.ctaAction}
                    className={`w-full h-11 text-sm font-medium ${
                      plan.popular 
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                        : 'variant-outline'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 bg-primary/5 p-8 rounded-lg border max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Questions About Pricing?</h3>
          <p className="text-foreground/80 mb-6">
            Need a custom solution or have questions? I'm here to help you find the right fit.
          </p>
          <Button 
            variant="outline"
            onClick={() => window.open('mailto:darylperis.cm@gmail.com?subject=Pricing Inquiry')}
          >
            Contact Me
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;