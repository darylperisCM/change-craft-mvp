import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmailCollection } from '@/components/EmailCollection';
import { FormData } from '@/components/ChangeAssessmentForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const EmailCollectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem('changeAssessmentData');
    if (!storedData) {
      navigate('/');
      return;
    }
    
    const data = JSON.parse(storedData) as FormData;
    setFormData(data);
  }, [navigate]);

  const handleEmailSubmit = async (email: string) => {
    if (!formData) return;
    
    setLoading(true);
    
    try {
      // Store email for the results page
      sessionStorage.setItem('userEmail', email);
      
      // Navigate to results which will generate strategy and send email
      navigate('/results');
    } catch (error) {
      console.error('Error processing email:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!formData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center p-4">
      <EmailCollection onSubmit={handleEmailSubmit} loading={loading} />
    </div>
  );
};

export default EmailCollectionPage;