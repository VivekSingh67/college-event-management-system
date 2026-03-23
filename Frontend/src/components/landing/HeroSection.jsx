import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-[92vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="College campus event" className="w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero opacity-80" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary/20 border border-secondary/30 px-4 py-1.5 mb-6">
            <Sparkles className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium text-secondary-foreground/90">Streamline Your Campus Events</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
            College Event{" "}
            <span className="text-secondary">Management</span>{" "}
            System
          </h1>

          <p className="text-lg text-primary-foreground/80 max-w-xl mb-8 leading-relaxed">
            A unified platform for organizing, approving, and managing college events.
            From creation to certification — everything in one place.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button size="lg" variant="secondary" className="gap-2" asChild>
              <a href="#events">
                Explore Events
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <a href="/login">Login</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
