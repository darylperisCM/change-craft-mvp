import { ChangeAssessmentForm } from "@/components/ChangeAssessmentForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Assessment = () => {
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
              <a href="/assessment" className="text-primary font-semibold">Start Assessment</a>
              <a href="/pricing" className="text-foreground/80 hover:text-primary transition-colors">Pricing</a>
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

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Start Your Free Change Management Assessment
            </h1>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              Answer a few questions about your organization and change requirements to receive AI-generated recommendations tailored to your specific needs. Accessible change management for organizations of all sizes and budgets.
            </p>
          </div>

          <ChangeAssessmentForm />
        </div>
      </div>
    </div>
  );
};

export default Assessment;