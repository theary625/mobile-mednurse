import { useRef, useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  experience: string | null;
  rating: number;
  image_url?: string | null;
}

// Fallback testimonials if database is empty
const fallbackTestimonials = [
  {
    id: "1",
    name: "Sarah Mitchell, RN, BSN",
    role: "ICU Nurse",
    experience: "Johns Hopkins Hospital",
    rating: 5,
    quote: "MedNurse has become an essential part of my daily practice. The drug interaction alerts have helped me catch potential issues before they become problems.",
  },
  {
    id: "2",
    name: "Dr. James Chen, PharmD",
    role: "Clinical Pharmacist",
    experience: "Mayo Clinic",
    rating: 5,
    quote: "The evidence-based protocols keep our nursing staff informed. It's reduced medication errors by 40% in our unit.",
  },
  {
    id: "3",
    name: "Maria Rodriguez, RN, MSN",
    role: "Nurse Educator",
    experience: "Cleveland Clinic",
    rating: 5,
    quote: "The CE credit courses are fantastic. I've completed my annual requirements entirely through MedNurse.",
  },
  {
    id: "4",
    name: "David Thompson, RN",
    role: "Emergency Department",
    experience: "Massachusetts General",
    rating: 5,
    quote: "In the fast-paced ED environment, I need quick access to accurate medication information. MedNurse delivers exactly that.",
  },
];

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  
  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('id, quote, name, role, experience, rating, image_url')
        .eq('feature_page', 'home')
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        setTestimonials(data);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            <Star className="w-4 h-4 fill-current" />
            <span>Trusted by Healthcare Professionals</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            What Our <span className="text-primary">Community</span> Says
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real stories from nurses and healthcare professionals using MedNurse daily.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[autoplayPlugin.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.name} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="group bg-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-medium hover:-translate-y-1 transition-all duration-300 h-full">
                  {/* Quote icon */}
                  <Quote className="w-8 h-8 text-primary/20 mb-4" />

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-warning fill-current" />
                    ))}
                  </div>

                  {/* Quote text */}
                  <p className="text-foreground/80 leading-relaxed mb-6 text-sm lg:text-base">
                    "{testimonial.quote}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    {testimonial.image_url ? (
                      <img
                        src={testimonial.image_url}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                        <span className="text-primary font-semibold text-lg">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                      {testimonial.experience && (
                        <p className="text-xs text-primary">
                          {testimonial.experience}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-4 mt-8">
            <CarouselPrevious className="relative inset-0 translate-x-0 translate-y-0 bg-primary/10 hover:bg-primary/20 border-primary/20" />
            <CarouselNext className="relative inset-0 translate-x-0 translate-y-0 bg-primary/10 hover:bg-primary/20 border-primary/20" />
          </div>
        </Carousel>

      </div>
    </section>
  );
};

export default TestimonialsSection;
