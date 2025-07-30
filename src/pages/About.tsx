import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Linkedin, Mail } from "lucide-react";

const About = () => {
  const navigate = useNavigate();

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
              <a href="/pricing" className="text-foreground/80 hover:text-primary transition-colors">Pricing</a>
              <a href="/about" className="text-primary font-semibold">About Us</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Why I Built Change Craft</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-1">
            <Card variant="teal" className="border-2">
              <CardContent className="p-6 text-center">
                <div className="w-32 h-32 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">D</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">Daryl Peris</h2>
                <p className="text-foreground/80 mb-4">Change Management Specialist</p>
                <div className="flex justify-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://www.linkedin.com/in/darylperis/', '_blank')}
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('mailto:darylperis.cm@gmail.com')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-foreground/80 mb-6">
                Hi, I'm Daryl — a Prosci-certified Change Management specialist with a background in 
                sustainable procurement and ESG. I created Change Craft to democratize change management — 
                especially for individuals and small organizations that can't afford expensive consultancies.
              </p>
              
              <p className="text-foreground/80 mb-6">
                Throughout my career, I've seen too many well-intentioned initiatives fail not because of 
                poor strategy or technology, but because organizations didn't properly manage the human side 
                of change. Change Craft is my solution to make proven change management methodologies 
                accessible to everyone.
              </p>

              <Card variant="coral" className="p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">My Credentials & Experience:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Prosci Certified Change Management Practitioner</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>10+ years in Sustainable Procurement & ESG</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Built Change Craft as a solo founder</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Passionate about capability building and accessible transformation</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <Card variant="mint" className="mb-12">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4 text-center">My Mission</h3>
            <p className="text-lg text-foreground/80 text-center max-w-3xl mx-auto">
              To make structured, proven change management tools accessible to everyone — from individual 
              contributors leading small initiatives to growing organizations implementing major transformations. 
              Change shouldn't be something only large corporations with big budgets can do well.
            </p>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card variant="peach" className="text-center p-8">
          <h3 className="text-2xl font-bold mb-4">Let's Connect</h3>
          <p className="text-foreground/80 mb-6">
            Have questions about change management or want to discuss your specific situation? 
            I'd love to hear from you.
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => window.open('https://www.linkedin.com/in/darylperis/', '_blank')}
              className="bg-primary hover:bg-primary/90"
            >
              <Linkedin className="h-4 w-4 mr-2" />
              Connect on LinkedIn
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.open('mailto:darylperis.cm@gmail.com')}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default About;