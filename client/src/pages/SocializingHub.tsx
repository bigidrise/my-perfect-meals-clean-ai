import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useLocation } from "wouter";
import { MapPin, Sparkles, ArrowLeft } from "lucide-react";

export default function SocializingHub() {
  const [, setLocation] = useLocation();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 pb-safe-nav"
    >
      {/* Universal Safe-Area Header */}
      <div
        className="fixed left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10"
        style={{ top: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="px-8 py-3 flex items-center gap-3">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => setLocation("/lifestyle")}
            className="flex items-center gap-2 text-white hover:bg-white/10 transition-all duration-200 p-2"
            data-testid="button-back-lifestyle"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          {/* Title */}
          <h1 className="text-lg font-bold text-white">
            Socializing Hub
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="max-w-5xl mx-auto px-4 pb-8"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 6rem)" }}
      >
        {/* Hero Image Section */}
        <div className="relative h-48 rounded-xl overflow-hidden mb-6">
          <img 
            src="/images/social-hero-placeholder.jpg" 
            alt="Socializing nutrition"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23f97316;stop-opacity:0.3' /%3E%3Cstop offset='100%25' style='stop-color:%23ec4899;stop-opacity:0.3' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='200' fill='url(%23g)'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='white' font-size='20' font-family='sans-serif' dy='.3em'%3EGoing out? Stay on track%3C/text%3E%3C/svg%3E";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white/90 text-base font-medium">
              Going out? Stay on track without missing the fun.
            </p>
          </div>
        </div>

        {/* Two Card Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Restaurant Guide */}
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Sparkles className="w-4 h-4" /> Restaurant Guide
              </CardTitle>
              <CardDescription className="text-white/70 text-sm">
                Get AI-powered healthy options from any restaurant.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setLocation("/social-hub/restaurant-guide")}
                className="bg-white text-black w-full hover:bg-white/90 transition-colors"
                data-testid="button-restaurant-guide"
              >
                Open Restaurant Guide
              </Button>
            </CardContent>
          </Card>

          {/* Card 2: Find Meals Near Me */}
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <MapPin className="w-4 h-4" /> Find Meals Near Me
              </CardTitle>
              <CardDescription className="text-white/70 text-sm">
                Search local restaurants by craving and ZIP code.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setLocation("/social-hub/find")}
                className="bg-white text-black w-full hover:bg-white/90 transition-colors"
                data-testid="button-find-meals"
              >
                Find Meals Near Me
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
