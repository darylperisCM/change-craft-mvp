import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LearnMore = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Learn More: Why Change Management Matters
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              In today's fast-moving world, change is not an option—it's a necessity. Whether it's digital transformation, cultural shifts, process overhauls, or regulatory alignment, organizations must evolve or risk falling behind.
            </p>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              But transformation without structure often leads to confusion, resistance, and failure. That's where Change Management steps in.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-semibold">What is Change Management?</h2>
                <p className="text-muted-foreground">
                  Change Management is a structured approach that supports individuals, teams, and organizations in making successful transitions. It ensures that the people side of change is not left behind—because without people, there is no change.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-semibold">Why Invest in Change Management?</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p><strong>Increases project success rates:</strong> Organizations that apply change management are up to 6x more likely to meet project objectives (Prosci).</p>
                  <p><strong>Reduces resistance and confusion:</strong> A well-crafted change strategy addresses fears, aligns expectations, and builds trust.</p>
                  <p><strong>Drives adoption:</strong> Whether you're introducing a new platform or process, change management ensures your teams don't just know about it—they embrace it.</p>
                  <p><strong>Protects ROI:</strong> Every transformation effort carries investment. Change management protects that investment by enabling fast, effective adoption.</p>
                  <p><strong>Builds a resilient culture:</strong> Change-capable organizations adapt faster and with greater confidence.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Effectiveness Comparison Chart */}
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">The Impact of Structured Change Management</h2>
              <p className="text-muted-foreground text-center mb-8">
                Data from Prosci research shows dramatic differences in success rates between organizations with effective change management versus those with poor change management practices.
              </p>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-center">Excellent Change Management</h3>
                    <div className="relative">
                      <div className="bg-primary/20 rounded-lg p-6 text-center">
                        <div className="text-4xl font-bold text-primary mb-2">93%</div>
                        <div className="text-sm text-muted-foreground">Projects meet or exceed objectives</div>
                      </div>
                      <div className="mt-4 bg-primary h-2 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-center">Poor Change Management</h3>
                    <div className="relative">
                      <div className="bg-destructive/20 rounded-lg p-6 text-center">
                        <div className="text-4xl font-bold text-destructive mb-2">15%</div>
                        <div className="text-sm text-muted-foreground">Projects meet or exceed objectives</div>
                      </div>
                      <div className="mt-4 bg-destructive h-2 rounded-full w-[16%]"></div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    Source: Prosci Best Practices in Change Management Research
                  </p>
                  <p className="text-sm font-medium text-primary mt-2">
                    Organizations with excellent change management are 7x more likely to achieve their goals
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold">What the Leaders Say</h2>
              <div className="space-y-4">
                <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground">
                  "Change is the law of life. And those who look only to the past or present are certain to miss the future."
                  <footer className="mt-2 text-sm font-medium text-foreground">— John F. Kennedy</footer>
                </blockquote>
                
                <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground">
                  "We underestimated how critical change management was to our digital transformation. Once we embedded it, adoption soared and resistance dropped almost overnight."
                  <footer className="mt-2 text-sm font-medium text-foreground">— CIO, Fortune 500 logistics company</footer>
                </blockquote>
                
                <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground">
                  "Culture eats strategy for breakfast—and change management is how you get culture to sit at the table."
                  <footer className="mt-2 text-sm font-medium text-foreground">— Sheryl Sandberg, Former COO, Meta</footer>
                </blockquote>
                
                <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground">
                  "When we introduced our new global procurement system, it was our change ambassadors and structured communication plan that made the rollout a success."
                  <footer className="mt-2 text-sm font-medium text-foreground">— Head of Transformation, Global Retail Brand</footer>
                </blockquote>
                
                <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground">
                  "Change management is no longer a luxury. It's a core competency in how we deliver impact—especially in sustainability, compliance, and digital innovation."
                  <footer className="mt-2 text-sm font-medium text-foreground">— Director of ESG, Multinational Manufacturing Firm</footer>
                </blockquote>
              </div>
            </CardContent>
          </Card>

          <div className="text-center pt-8">
            <Button
              onClick={() => navigate("/")}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              Get Started with Your Change Assessment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;