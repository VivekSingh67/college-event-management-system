import { motion } from "framer-motion";
import { FileText, CheckCircle, Users, PartyPopper, Award } from "lucide-react";

const steps = [
  { icon: FileText, title: "Admin Creates Event", desc: "Branch admin or faculty creates and submits event details." },
  { icon: CheckCircle, title: "HOD Approves Event", desc: "Head of Department reviews and approves the event." },
  { icon: Users, title: "Students Register", desc: "Students browse and register for approved events." },
  { icon: PartyPopper, title: "Event Participation", desc: "Attendance is marked during the event." },
  { icon: Award, title: "Certificates Generated", desc: "Participants receive auto-generated certificates." },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A streamlined five-step process from event creation to certification.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

          <div className="space-y-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-6"
              >
                <div className="relative z-10 flex-shrink-0 h-12 w-12 rounded-full gradient-hero flex items-center justify-center">
                  <s.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="bg-card border border-border rounded-xl p-5 flex-1 shadow-card">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-secondary">Step {i + 1}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-card-foreground mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
