import { MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";

const events = [
  { img: event1, title: "Tech Innovation Summit", date: "Mar 25, 2026", location: "Main Auditorium", tag: "Technical" },
  { img: event2, title: "Annual Cultural Fest", date: "Apr 10, 2026", location: "Open Air Theater", tag: "Cultural" },
  { img: event3, title: "Inter-College Sports Meet", date: "Apr 20, 2026", location: "Sports Complex", tag: "Sports" },
];

export function EventsSection() {
  return (
    <section id="events" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Upcoming Events</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover and register for exciting events happening on campus.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((e, i) => (
            <motion.div
              key={e.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border group"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={e.img} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  {e.tag}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-card-foreground mb-3">{e.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {e.date}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {e.location}</span>
                </div>
                <Button size="sm" className="w-full">Register Now</Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
