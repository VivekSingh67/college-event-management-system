import { motion } from "framer-motion";
import { Calendar, Users, Building2, Trophy } from "lucide-react";

const stats = [
  { icon: Calendar, value: "250+", label: "Total Events" },
  { icon: Users, value: "12,000+", label: "Total Students" },
  { icon: Building2, value: "15", label: "Active Departments" },
  { icon: Trophy, value: "8,500+", label: "Participations" },
];

export function StatsSection() {
  return (
    <section className="py-20 gradient-hero">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <s.icon className="h-8 w-8 text-secondary mx-auto mb-3" />
              <div className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-1">{s.value}</div>
              <div className="text-sm text-primary-foreground/70">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
