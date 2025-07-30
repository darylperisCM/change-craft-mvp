import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface EmailCollectionProps {
  onSubmit: (email: string) => void;
  loading?: boolean;
}

export const EmailCollection: React.FC<EmailCollectionProps> = ({ onSubmit, loading = false }) => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Please enter a valid email address",
        description: "We'll send your strategy summary to this email.",
        variant: "destructive"
      });
      return;
    }

    onSubmit(email);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-wide">
          Your Strategy is Ready!
        </CardTitle>
        <CardDescription className="text-lg mt-4 text-foreground/70 max-w-xl mx-auto leading-relaxed">
          Get instant access to your personalized change management strategy and receive a PDF copy via email
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-lg font-semibold text-foreground">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@company.com"
              className="h-12 text-lg border-2 rounded-modern input-focus"
              disabled={loading}
              required
            />
            <p className="text-sm text-muted-foreground">
              We'll send your strategy summary and explore options for our premium toolkits
            </p>
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full font-bold text-lg animate-scale-in"
            disabled={loading || !email}
          >
            {loading ? "Preparing Your Strategy..." : "Get My Strategy & PDF"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};