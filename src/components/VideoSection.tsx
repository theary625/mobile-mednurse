import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Pause, Volume2, VolumeX } from "lucide-react";
import landingVideo from "@/assets/landing-video.mp4";
import { useVideoContent } from "@/hooks/useVideoContent";

const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { content, isVisible } = useVideoContent();

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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = clickPosition * videoRef.current.duration;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (isMuted) {
        videoRef.current.volume = volume;
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      if (newVolume === 0) {
        setIsMuted(true);
        videoRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  if (!isVisible) return null;

  // Use external URL if provided, otherwise use local video
  const videoSource = content.videoUrl || landingVideo;

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Video Side */}
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
          <div 
            className="w-full max-w-sm relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent rounded-2xl blur-xl" />
              
              {/* Decorative corner accents */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-lg z-10" />
              <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-lg z-10" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-accent rounded-bl-lg z-10" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-accent rounded-br-lg z-10" />
              
              <video
                ref={videoRef}
                className="relative w-full rounded-t-2xl shadow-soft object-cover bg-transparent border-2 border-b-0 border-primary/20 ring-1 ring-accent/10"
                autoPlay={content.autoplay}
                loop={content.loop}
                muted
                playsInline
                onTimeUpdate={handleTimeUpdate}
                poster={content.posterUrl || undefined}
              >
                <source src={videoSource} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Progress Bar */}
              {content.showControls && (
                <div 
                  className="relative w-full h-2 bg-muted/50 rounded-b-2xl cursor-pointer border-2 border-t-0 border-primary/20"
                  onClick={handleProgressClick}
                >
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent rounded-bl-xl transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
              
              {/* Play/Pause Button Overlay */}
              {content.showControls && (
                <button
                  onClick={togglePlayPause}
                  className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  <div className="w-14 h-14 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 hover:scale-110 shadow-lg">
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-primary-foreground" />
                    ) : (
                      <Play className="w-6 h-6 text-primary-foreground ml-1" />
                    )}
                  </div>
                </button>
              )}

              {/* Volume Control */}
              {content.showControls && (
                <div 
                  className={`absolute bottom-10 right-3 z-30 flex items-center gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  {showVolumeSlider && (
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 accent-primary cursor-pointer"
                    />
                  )}
                  <button
                    onClick={toggleMute}
                    className="w-8 h-8 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 hover:scale-110 shadow-lg"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-primary-foreground" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-primary-foreground" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Heading Side */}
          <div className="text-center lg:text-left order-1 lg:order-2">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight mb-4">
              <span className="text-primary">{content.headline}</span>
              <br />
              <span className="text-accent">{content.headlineAccent}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 mb-6">
              {content.description}
            </p>
            <Link to={content.ctaLink}>
              <Button variant="accent" size="lg" className="gap-2">
                {content.ctaText}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
