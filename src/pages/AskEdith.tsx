import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { MessageCircle, Sparkles, Shield, Clock, Brain, Calculator, Pill, BookOpen, ArrowRight, CheckCircle, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LandingChatbot from "@/components/LandingChatbot";
import { supabase } from "@/integrations/supabase/client";
import edithMascot from "@/assets/edith-clinical-setting.png";

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  experience: string | null;
  rating: number;
}

const AskEdith = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('id, quote, name, role, experience, rating')
        .eq('feature_page', 'ask-edith')
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (!error && data) {
        setTestimonials(data);
      }
      setIsLoading(false);
    };

    fetchTestimonials();
  }, []);

  const features = [
    {
      icon: MessageCircle,
      title: "24/7 AI Nursing Assistant",
      description: "Get instant answers to medication questions any time of day or night. Edith is always ready to help during your shift."
    },
    {
      icon: Calculator,
      title: "Dosage Calculations",
      description: "Quick, accurate dosage calculations for IV drip rates, weight-based dosing, and unit conversions with step-by-step explanations."
    },
    {
      icon: Shield,
      title: "Safety Checks",
      description: "Verify medication safety with contraindication checks, drug interaction alerts, and administration best practices."
    },
    {
      icon: Pill,
      title: "Drug Information",
      description: "Access comprehensive drug monographs including indications, dosing, side effects, and nursing considerations."
    },
    {
      icon: Brain,
      title: "Clinical Decision Support",
      description: "Evidence-based guidance for complex clinical scenarios, helping you make informed decisions at the bedside."
    },
    {
      icon: BookOpen,
      title: "Learning & Reference",
      description: "Refresh your knowledge on protocols, procedures, and pharmacology with clear, concise explanations."
    }
  ];

  const exampleQuestions = [
    "What are the 5 rights of medication administration?",
    "Calculate IV drip rate: 1000mL over 8 hours",
    "What's the antidote for heparin overdose?",
    "High-alert medications I should know",
    "Morphine vs Hydromorphone equianalgesic dosing",
    "What labs to monitor for vancomycin?",
    "Signs of digoxin toxicity",
    "Insulin sliding scale guidelines"
  ];

  const benefits = [
    "Instant answers when you need them most",
    "Evidence-based clinical information",
    "Conversation history saved for reference",
    "Opioid quick-reference database",
    "No judgment, just support",
    "Continuously learning and improving"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Ask Edith - AI Nursing Assistant for Medication Safety | MedNurse</title>
        <meta 
          name="description" 
          content="Meet Nurse Edith, your AI-powered medication safety companion. Get instant answers to drug questions, dosage calculations, and clinical guidance 24/7. Trusted by nurses everywhere." 
        />
        <meta 
          name="keywords" 
          content="AI nursing assistant, medication questions, drug dosage calculator, nursing AI, clinical decision support, medication safety AI" 
        />
        <link rel="canonical" href="https://mednurse.com/ask-edith" />
      </Helmet>
      
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
          <div className="container mx-auto px-4 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Included with Membership
                </Badge>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Meet <span className="text-primary">Nurse Edith</span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                  Your AI medication safety companion. Ask questions, get instant answers, and make confident clinical decisions at the bedside.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild size="lg" className="gap-2">
                    <Link to="/plans">
                      <Sparkles className="w-4 h-4" />
                      Start Membership
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/dashboard-mock">
                      See Demo
                    </Link>
                  </Button>
                </div>
                
                <div className="flex items-center gap-4 pt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Included with every plan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Unlimited AI conversations</span>
                  </div>
                </div>
              </div>
              
              <div className="relative flex justify-center">
                <div className="relative">
                  <img 
                    src={edithMascot} 
                    alt="Nurse Edith - AI Assistant" 
                    className="relative w-64 md:w-80 lg:w-96 drop-shadow-2xl rounded-2xl"
                  />
                </div>
                
                {/* Floating chat bubbles */}
                <div className="absolute top-8 -left-4 bg-card/90 backdrop-blur-sm border border-border/50 rounded-2xl p-3 shadow-lg max-w-[200px] animate-pulse">
                  <p className="text-xs text-muted-foreground">"What's the max dose of acetaminophen?"</p>
                </div>
                <div className="absolute bottom-12 -right-4 bg-primary text-primary-foreground rounded-2xl p-3 shadow-lg max-w-[220px]">
                  <p className="text-xs">4g/day for adults, 3g/day for elderly or hepatic impairment...</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Grid */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Can Edith Help With?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From quick calculations to complex clinical questions, Edith is designed to support nurses throughout their shift.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Example Questions */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ask Anything</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Edith understands natural language. Just type your question like you would ask a colleague, and get clear, actionable answers.
                </p>
                
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-card border rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Example Questions</h3>
                    <p className="text-sm text-muted-foreground">Try asking Edith...</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {exampleQuestions.map((question, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-muted/50 rounded-xl text-sm hover:bg-muted transition-colors cursor-pointer"
                    >
                      "{question}"
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Getting started with Nurse Edith takes just seconds.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">Choose Your Plan</h3>
                <p className="text-muted-foreground">Select the plan that fits your needs and unlock Nurse Edith.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">Ask Your Question</h3>
                <p className="text-muted-foreground">Type your medication or clinical question naturally.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">Get Instant Answers</h3>
                <p className="text-muted-foreground">Receive clear, evidence-based responses in seconds.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Nurses Everywhere</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See what healthcare professionals are saying about their experience with Nurse Edith.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-card">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    
                    <div className="relative mb-4">
                      <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/10" />
                      <p className="text-muted-foreground italic pl-4">
                        "{testimonial.quote}"
                      </p>
                    </div>
                    
                    <div className="pt-4 border-t border-border">
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-primary">{testimonial.role}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.experience}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 md:p-12 text-center text-primary-foreground">
              <div className="flex justify-center mb-6">
                <img src={edithMascot} alt="Nurse Edith" className="w-24 h-24 drop-shadow-lg" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Meet Edith?</h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Join thousands of nurses who trust Edith for medication safety support. Start your membership to get full access.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="gap-2">
                  <Link to="/plans">
                    <Sparkles className="w-4 h-4" />
                    Start Membership
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10">
                  <Link to="/contact">
                    Contact Sales
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <LandingChatbot />
    </div>
  );
};

export default AskEdith;