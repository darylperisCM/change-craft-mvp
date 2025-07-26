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
      title: "Complete Toolkit",
      price: "$99",
      priceNote: "one-time",
      description: "Templates and tools to implement your strategy with confidence.",
      features: [
        "Editable stakeholder map, comms plan, trackers",
        "PPT + Excel files",
        "Lifetime access",
        "Implementation guides"
      ],
      cta: "Get the Toolkit",
      ctaAction: () => window.open('mailto:darylperis.cm@gmail.com?subject=Toolkit Purchase Inquiry'),
      popular: true
    },
    {
      title: "Live Expert Session",
      price: "$60",
      priceNote: "/ hour",
      description: "Book a tailored consultation with a certified CM expert.",
      features: [
        "Review your plan",
        "Practical advice for implementation",
        "60-minute session",
        "Follow-up resources"
      ],
      cta: "Book Now",
      ctaAction: () => window.open('https://www.linkedin.com/in/darylperis/'),
      popular: false
    },
    {
      title: "Change Craft Pro",
      price: "$10",
      priceNote: "/month",
      description: "Access advanced tools, plan history, and exclusive webinars.",
      features: [
        "Save multiple plans",
        "Premium resources",
        "Monthly Q&As",
        "Priority support"
      ],
      cta: "Join the Waitlist",
      ctaAction: () => window.open('mailto:darylperis.cm@gmail.com?subject=Pro Membership Waitlist'),
      popular: false,
      comingSoon: true
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative transition-all duration-300 hover:shadow-lg ${
                plan.popular ? 'border-primary shadow-lg scale-105' : 'hover:scale-105'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              {plan.comingSoon && (
                <Badge variant="secondary" className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  Coming Soon
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.title}</CardTitle>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-primary">{plan.price}</span>
                  {plan.priceNote && (
                    <span className="text-foreground/60">{plan.priceNote}</span>
                  )}
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={plan.ctaAction}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-primary hover:bg-primary/90' 
                      : 'variant-outline'
                  }`}
                  disabled={plan.comingSoon}
                >
                  {plan.cta}
                </Button>
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