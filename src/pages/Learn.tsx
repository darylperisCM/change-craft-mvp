import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, TrendingUp, CheckCircle } from "lucide-react";

const Learn = () => {
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
              <a href="/learn" className="text-primary font-semibold">Learn More</a>
              <a href="/assessment" className="text-foreground/80 hover:text-primary transition-colors">Start Assessment</a>
              <a href="/pricing" className="text-foreground/80 hover:text-primary transition-colors">Pricing</a>
              <a href="/about" className="text-foreground/80 hover:text-primary transition-colors">About Us</a>
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

        {/* What is Change Management? */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">What is Change Management?</h2>
          <div className="prose prose-lg max-w-none text-foreground/80">
            <p className="mb-4">
              Change management is the structured approach to transitioning individuals, teams, and organizations 
              from a current state to a desired future state. It's the "people side" of change that ensures 
              successful adoption and implementation of new processes, technologies, or organizational structures.
            </p>
            <p>
              Without proper change management, even the best strategies can fail due to resistance, confusion, 
              or lack of engagement from the people who need to make the change happen.
            </p>
          </div>
        </section>

        {/* Why It Matters */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">Why It Matters</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-card p-6 rounded-lg border">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-semibold">Success Rates</h3>
              </div>
              <p className="text-foreground/80">
                Projects with excellent change management are 6x more likely to meet objectives 
                compared to those with poor change management.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-semibold">People Impact</h3>
              </div>
              <p className="text-foreground/80">
                70% of change initiatives fail due to employee resistance and lack of management support, 
                not technical issues.
              </p>
            </div>
          </div>
          
          <div className="bg-primary/5 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Research Shows:</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Organizations with strong change management capabilities are 2.5x more likely to exceed project expectations</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Effective communication during change reduces resistance by up to 80%</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Proper stakeholder engagement increases project success rates by 40%</span>
              </li>
            </ul>
          </div>
        </section>

        {/* How Change Craft Helps */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">How Change Craft Helps</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Assess Your Situation</h3>
              <p className="text-foreground/80">
                Answer questions about your change initiative to understand the scope and complexity.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Your Plan</h3>
              <p className="text-foreground/80">
                Receive a customized change management strategy with actionable recommendations.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Take Action</h3>
              <p className="text-foreground/80">
                Implement your plan with confidence using proven change management frameworks.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center bg-primary/5 p-8 rounded-lg border">
          <h3 className="text-2xl font-bold mb-4">Ready to Start Your Change Journey?</h3>
          <p className="text-foreground/80 mb-6">
            Get your personalized change management plan in minutes — completely free.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/assessment')}
            className="bg-primary hover:bg-primary/90"
          >
            Start Your Free Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Learn;