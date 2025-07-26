import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChangeAssessmentForm } from '@/components/ChangeAssessmentForm';
import { ArrowRight, Users, Target, TrendingUp, CheckCircle, Check, Mail, Linkedin, Calendar, Download, MessageCircle } from 'lucide-react';
import heroImage from '@/assets/hero-change-management.jpg';

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
      {/* Sticky Navigation Header */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-foreground">Change Craft</h1>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Smart Change Management Planning — Free to Start, Built for Everyone
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => navigate('/learn-more')}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Learn More
              </button>
              <button 
                onClick={() => document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Start Assessment
              </button>
              <button 
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </button>
              <button 
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                About Us
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Keep as-is */}
      <section className="relative overflow-hidden bg-section-gradient">
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
                  className="bg-hero-gradient hover:opacity-90 transition-smooth group"
                  onClick={() => document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Start Your Free Assessment
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-smooth" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/learn-more')}
                >
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

      {/* Pricing Section */}
      <section id="pricing" className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Free to get started. Pay only if you need advanced tools or expert guidance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="shadow-card hover:shadow-hero transition-smooth border-2 border-primary/20">
              <CardContent className="p-8 text-center space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Free Plan</h3>
                  <div className="text-3xl font-bold text-primary">$0</div>
                </div>
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Generate your Change Management Report</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Requires simple user login</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Access to basic recommendations</span>
                  </div>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Start Free Assessment
                </Button>
              </CardContent>
            </Card>

            {/* Template Pack */}
            <Card className="shadow-card hover:shadow-hero transition-smooth border-2 border-primary/40">
              <CardContent className="p-8 text-center space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Template Pack</h3>
                  <div className="text-3xl font-bold text-primary">$100</div>
                  <div className="text-sm text-muted-foreground">one-time</div>
                </div>
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Download 10+ editable templates and planners</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Implementation strategy tools</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Includes stakeholder map, training tracker, comms plan</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Get Templates
                </Button>
              </CardContent>
            </Card>

            {/* 1:1 Consultation */}
            <Card className="shadow-card hover:shadow-hero transition-smooth border-2 border-primary/20">
              <CardContent className="p-8 text-center space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">1:1 Live Consultation</h3>
                  <div className="text-3xl font-bold text-primary">$60</div>
                  <div className="text-sm text-muted-foreground">per hour</div>
                </div>
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>60-minute session with a certified Change Manager</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Tailored advice for your specific case</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Book via calendar link</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Book Session
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">About the Creator</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-muted rounded-full flex items-center justify-center">
                  <Users className="w-24 h-24 text-muted-foreground" />
                </div>
              </div>
              
              <div className="lg:col-span-2 space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Hi, I'm <strong>Daryl</strong> — a certified Change Management professional with experience 
                  leading transformation initiatives across industries. I built Change Craft to democratize 
                  access to structured, proven CM tools — especially for individuals or small organizations 
                  that can't afford expensive consultancies. This platform is for you.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Prosci Certified Practitioner</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>10+ years in Sustainable Procurement & ESG</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Built Change Craft as a solo founder</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Passionate about capability building</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Me
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Book a Call
                  </Button>
                </div>
              </div>
            </div>
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
              Accessible change management for organizations of all sizes and budgets.
            </p>
          </div>
          
          <ChangeAssessmentForm />
        </div>
      </section>
    </div>
  );
};

export default Index;
