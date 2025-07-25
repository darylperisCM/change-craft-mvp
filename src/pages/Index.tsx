import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChangeAssessmentForm } from '@/components/ChangeAssessmentForm';
import { ArrowRight, Users, Target, TrendingUp, CheckCircle } from 'lucide-react';
import heroImage from '@/assets/hero-change-management.jpg';

const Index = () => {
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
    <div className="min-h-screen bg-section-gradient">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Navigate Change with
                  <span className="bg-hero-gradient bg-clip-text text-transparent block">
                    Confidence
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Transform your organization's approach to change management with AI-powered insights, 
                  personalized strategies, and proven frameworks that drive successful outcomes.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-hero-gradient hover:opacity-90 transition-smooth group"
                  onClick={() => document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Start Assessment
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-smooth" />
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Organizations Helped</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">95%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Industries Served</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-hero">
                <img 
                  src={heroImage} 
                  alt="Change Management Team Collaboration" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-hero-gradient opacity-10"></div>
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
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive approach combines proven methodologies with AI-powered insights 
              to deliver personalized change management strategies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-hero transition-smooth border-0">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Form Section */}
      <section id="assessment" className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Get Your Personalized Strategy
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Answer a few questions about your organization and change requirements 
              to receive AI-generated recommendations tailored to your specific needs.
            </p>
          </div>
          
          <ChangeAssessmentForm />
        </div>
      </section>
    </div>
  );
};

export default Index;
