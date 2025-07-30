import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Users, Target, TrendingUp, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-change-management.jpg";

const Index = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: Target,
      title: "Strategic Planning",
      description: "Develop comprehensive change strategies tailored to your organization's specific needs and constraints."
    },
    {
      icon: Users,
      title: "Stakeholder Engagement",
      description: "Identify and engage all stakeholders effectively throughout the change process with targeted communication."
    },
    {
      icon: TrendingUp,
      title: "Impact Assessment",
      description: "Analyze and measure the impact of changes across different organizational levels and functions."
    },
    {
      icon: CheckCircle,
      title: "Implementation Support",
      description: "Get framework recommendations and best practices to ensure successful change implementation."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass backdrop-blur-glass border-b">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-primary tracking-wide">Change Craft</h1>
              <span className="text-sm text-foreground/70 hidden md:inline font-medium">
                Smart Change Management Planning — Free to Start, Built for Everyone
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="/learn" className="text-foreground/80 hover:text-primary transition-all duration-200 font-medium">
                Learn More
              </a>
              <a href="/assessment" className="text-foreground/80 hover:text-primary transition-all duration-200 font-medium">
                Start Assessment
              </a>
              <a href="/pricing" className="text-foreground/80 hover:text-primary transition-all duration-200 font-medium">
                Pricing
              </a>
              <a href="/about" className="text-foreground/80 hover:text-primary transition-all duration-200 font-medium">
                About Us
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'var(--hero-gradient)' }}>
        <div className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 animate-fade-in">
              <div className="space-y-6">
                <div className="inline-block px-6 py-3 glass-card text-primary rounded-modern text-sm font-semibold mb-8 animate-scale-in">
                  ✨ Free Assessment for New Users
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-wide">
                  Navigate Change with
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block mt-2">
                    Confidence
                  </span>
                </h1>
                <p className="text-xl text-foreground/80 leading-relaxed max-w-2xl">
                  Transform your organization's approach to change management with AI-powered insights, 
                  personalized strategies, and proven frameworks that drive successful outcomes.
                </p>
                <div className="glass-card p-6 mt-6 animate-scale-in">
                  <p className="text-base text-foreground font-medium">
                    <strong className="text-primary">Perfect for Newcomers & Small Organizations:</strong> Professional change management 
                    guidance without the enterprise consulting costs. Designed for individual practitioners 
                    and resource-conscious teams.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Button 
                  size="lg" 
                  className="group animate-scale-in"
                  onClick={() => navigate('/assessment')}
                >
                  Start Your Free Assessment
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-all" />
                </Button>
                <Button 
                  size="lg" 
                  variant="glass"
                  onClick={() => navigate('/learn')}
                  className="animate-scale-in"
                >
                  Learn More
                </Button>
              </div>

            </div>
            
            <div className="relative animate-fade-in">
              <div className="glass-card p-6 rounded-3xl">
                <img 
                  src={heroImage} 
                  alt="Change Management Team Collaboration" 
                  className="w-full h-auto object-cover rounded-2xl card-hover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-4xl lg:text-6xl font-bold mb-8 tracking-wide">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive approach combines proven methodologies with AI-powered insights 
              to deliver personalized change management strategies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const cardVariants = ["coral", "peach", "teal", "lavender"];
              const variant = cardVariants[index % cardVariants.length];
              
              return (
              <Card 
                key={index} 
                variant={variant as any}
                className="text-center group animate-fade-in" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-xl mb-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
