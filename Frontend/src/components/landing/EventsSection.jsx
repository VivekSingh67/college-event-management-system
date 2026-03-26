import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { fetchEvents, selectEvents, selectEventsLoading } from "@/redux/slices/eventSlice";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export function EventsSection() {
  const dispatch = useDispatch();
  const { list: events, isLoading } = useSelector(selectEvents);

  useEffect(() => {
    // Fetch only a few recent/upcoming events for the landing page
    dispatch(fetchEvents({ limit: 3, sort: "-event_date" }));
  }, [dispatch]);

  // Fallback images if event_banner is missing
  const fallbackImages = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80",
    "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
  ];

  return (
    <section id="events" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 font-display text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Upcoming Events</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover and register for exciting events happening on campus.
          </p>
        </div>

        {isLoading && events.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 3).map((e, i) => (
              <motion.div
                key={e._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={e.event_banner || fallbackImages[i % 3]} 
                    alt={e.event_title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <span className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    {e.event_type}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-card-foreground mb-3 truncate">{e.event_title}</h3>
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1.5 truncate">
                      <Calendar className="h-4 w-4 text-primary" /> 
                      {format(new Date(e.event_date), "MMM dd, yyyy")}
                    </span>
                    <span className="flex items-center gap-1.5 truncate">
                      <MapPin className="h-4 w-4 text-primary" /> 
                      {e.location || "Online / Campus"}
                    </span>
                  </div>
                  <Button asChild size="sm" className="w-full">
                    <Link to="/login">Register Now</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
