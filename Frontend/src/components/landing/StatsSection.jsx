import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Calendar, Users, Building2, Trophy } from "lucide-react";
import { fetchEvents, selectEventsTotal, fetchRegistrations, selectRegistrations } from "@/redux/slices/eventSlice";
import { fetchStudents, selectStudents, fetchDepartments, selectDepartments } from "@/redux/slices/coreSlice";

export function StatsSection() {
  const dispatch = useDispatch();
  const eventTotal = useSelector(selectEventsTotal);
  const students = useSelector(selectStudents);
  const departments = useSelector(selectDepartments);
  const registrations = useSelector(selectRegistrations);

  useEffect(() => {
    dispatch(fetchEvents({ limit: 1 }));
    dispatch(fetchStudents({ limit: 1 }));
    dispatch(fetchDepartments({ limit: 1 }));
    dispatch(fetchRegistrations({ limit: 1 }));
  }, [dispatch]);

  const stats = [
    { icon: Calendar, value: eventTotal || 0, label: "Total Events" },
    { icon: Users, value: students.total || 0, label: "Total Students" },
    { icon: Building2, value: departments.total || 0, label: "Departments" },
    { icon: Trophy, value: registrations.total || 0, label: "Participations" },
  ];

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
              <div className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-1">{s.value}+</div>
              <div className="text-sm text-primary-foreground/70 uppercase tracking-wider font-semibold">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
