import { useState, useRef } from "react";
import { Shield, MapPin, Lightbulb, Play, Pause, Volume2, VolumeX } from "lucide-react";
import landingVideo from "@/assets/landing-video.mp4";
import { useFeaturesContent } from "@/hooks/useLandingContent";

const FeaturesSection = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { content, isVisible } = useFeaturesContent();

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Build features array from CMS content
  const features = [
    {
      icon: Shield,
      title: content.feature1Title,
      description: content.feature1Description,
      color: "primary",
    },
    {
      icon: MapPin,
      title: content.feature2Title,
      description: content.feature2Description,
      color: "accent",
    },
    {
      icon: Lightbulb,
      title: content.feature3Title,
      description: content.feature3Description,
      color: "success",
    },
  ];

  if (!isVisible) return null;

  return (
    <section id="features" className="py-16 lg:py-24 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-primary-glow text-primary rounded-full text-sm font-semibold uppercase tracking-wide mb-4">
            Platform Features
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-primary mb-4">
            {content.sectionTitle}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {content.sectionSubtitle}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Features List */}
          <div className="space-y-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group flex gap-5 p-6 bg-background rounded-2xl border border-border hover:shadow-medium hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                    feature.color === "primary"
                      ? "bg-primary-glow text-primary"
                      : feature.color === "accent"
                      ? "bg-accent-glow text-accent"
                      : "bg-success-glow text-success"
                  }`}
                >
                  <feature.icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
            <p className="text-sm text-primary font-medium pl-2">
              ✓ HIPAA compliant &nbsp;&nbsp; ✓ Updated daily
            </p>
          </div>

          {/* Video */}
          <div 
            className="relative max-w-sm mx-auto lg:mx-0 lg:ml-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Decorative glow */}
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent rounded-2xl blur-xl" />
            
            {/* Corner accents */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-lg z-10" />
            <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-lg z-10" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-accent rounded-bl-lg z-10" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-accent rounded-br-lg z-10" />
            
            <video
              ref={videoRef}
              className="relative w-full rounded-2xl shadow-soft object-cover bg-transparent border-2 border-primary/20"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={landingVideo} type="video/mp4" />
            </video>

            {/* Controls overlay */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <button
                onClick={togglePlayPause}
                className="w-14 h-14 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110 shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-primary-foreground" />
                ) : (
                  <Play className="w-6 h-6 text-primary-foreground ml-1" />
                )}
              </button>
            </div>

            {/* Volume button */}
            <button
              onClick={toggleMute}
              className={`absolute bottom-3 right-3 w-8 h-8 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 shadow-lg ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-primary-foreground" />
              ) : (
                <Volume2 className="w-4 h-4 text-primary-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
