import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, Target, TrendingUp, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-change-management.jpg";

const Index = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Strategic Planning",
      description: "Develop comprehensive change strategies tailored to your organization's specific needs and constraints."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Stakeholder Engagement",
      description: "Identify and engage all stakeholders effectively throughout the change process with targeted communication."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Impact Assessment",
      description: "Analyze and measure the impact of changes across different organizational levels and functions."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-primary" />,
      title: "Implementation Support",
      description: "Get framework recommendations and best practices to ensure successful change implementation."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-primary">Change Craft</h1>
              <span className="text-sm text-foreground/60 hidden md:inline">
                Smart Change Management Planning — Free to Start, Built for Everyone
              </span>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="/learn" className="text-foreground/80 hover:text-primary transition-colors">
                Learn More
              </a>
              <a href="/assessment" className="text-foreground/80 hover:text-primary transition-colors">
                Start Assessment
              </a>
              <a href="/pricing" className="text-foreground/80 hover:text-primary transition-colors">
                Pricing
              </a>
              <a href="/about" className="text-foreground/80 hover:text-primary transition-colors">
                About Us
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Navigate Change with
                  <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent block">
                    Confidence
                  </span>
                </h1>
                <p className="text-xl text-foreground/80 leading-relaxed">
                  Transform your organization's approach to change management with AI-powered insights, 
                  personalized strategies, and proven frameworks that drive successful outcomes.
                </p>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
                  <p className="text-base text-foreground">
                    <strong>Perfect for Newcomers & Small Organizations:</strong> Professional change management 
                    guidance without the enterprise consulting costs. Designed for individual practitioners 
                    and resource-conscious teams.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 group"
                  onClick={() => navigate('/assessment')}
                >
                  Start Your Free Assessment
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/learn')}
                >
                  Learn More
                </Button>
              </div>

            </div>
            
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <img 
                  src={heroImage} 
                  alt="Change Management Team Collaboration" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Our comprehensive approach combines proven methodologies with AI-powered insights 
              to deliver personalized change management strategies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-foreground/80">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
