import { CalendarPlus, UserCheck, ShieldCheck, Bell, ClipboardCheck, Award } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: CalendarPlus, title: "Easy Event Creation", desc: "Create and publish events in minutes with an intuitive form builder." },
  { icon: UserCheck, title: "Student Registration", desc: "Seamless registration flow for students to sign up for events." },
  { icon: ShieldCheck, title: "Event Approval Workflow", desc: "Multi-level approval system from HOD to administration." },
  { icon: Bell, title: "Notifications & Announcements", desc: "Real-time notifications to keep everyone informed." },
  { icon: ClipboardCheck, title: "Attendance Tracking", desc: "Digital attendance marking and participation records." },
  { icon: Award, title: "Certificates", desc: "Auto-generated certificates for event participation." },
];

export function FeaturesSection() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage college events efficiently from start to finish.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border"
            >
              <div className="h-12 w-12 rounded-lg gradient-accent flex items-center justify-center mb-4">
                <f.icon className="h-6 w-6 text-secondary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-card-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
