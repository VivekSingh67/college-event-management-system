import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Calendar,
  Users,
  Shield,
  Bell,
  BarChart3,
  CheckCircle2,
  GraduationCap,
  Building2,
  UserCog,
  Crown,
  ArrowRight,
  Sparkles,
  Globe,
  FileText,
  MessageSquare,
  Star,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const features = [
  {
    icon: Calendar,
    title: "Event Management",
    desc: "Create, schedule, and manage college events with an intuitive interface. Set dates, upload posters, and track registrations.",
  },
  {
    icon: Shield,
    title: "Multi-Level Approvals",
    desc: "Structured approval workflow from HOD → Branch Admin → Super Admin ensures proper authorization for every event.",
  },
  {
    icon: Users,
    title: "Role-Based Access",
    desc: "Four distinct roles — Super Admin, Branch Admin, HOD, and Student — each with tailored dashboards and permissions.",
  },
  {
    icon: Bell,
    title: "Real-Time Notifications",
    desc: "Instant alerts for event approvals, reminders, announcements, and application status updates.",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    desc: "Generate department-wise participation reports, export data to PDF/Excel, and track event performance.",
  },
  {
    icon: MessageSquare,
    title: "Queries & Feedback",
    desc: "Built-in query management and feedback submission system for continuous improvement.",
  },
];

const roles = [
  {
    icon: Crown,
    title: "Super Admin",
    color: "bg-primary/10 text-primary",
    powers: [
      "Manage all branches & departments",
      "Approve/reject events",
      "Create Branch Admins & HODs",
      "View institution-wide reports",
      "Send announcements",
      "Export all data",
    ],
  },
  {
    icon: Building2,
    title: "Branch Admin",
    color: "bg-accent/10 text-accent",
    powers: [
      "Manage departments in branch",
      "Create & assign HODs",
      "Create branch-level events",
      "Forward approvals to Super Admin",
      "View branch student data",
      "Branch announcements",
    ],
  },
  {
    icon: UserCog,
    title: "HOD",
    color: "bg-info/10 text-info",
    powers: [
      "Manage department students",
      "Create department events",
      "Approve student applications",
      "View department reports",
      "Handle student queries",
      "Department notifications",
    ],
  },
  {
    icon: GraduationCap,
    title: "Student",
    color: "bg-success/10 text-success",
    powers: [
      "Browse & apply for events",
      "Track application status",
      "View participation history",
      "Submit event feedback",
      "Receive event reminders",
      "Manage profile",
    ],
  },
];

const steps = [
  {
    num: "01",
    title: "Login with Role",
    desc: "Authenticate with your credentials and get redirected to your personalized dashboard.",
  },
  {
    num: "02",
    title: "Create or Browse Events",
    desc: "Admins create events with full details; students browse and discover upcoming opportunities.",
  },
  {
    num: "03",
    title: "Apply & Get Approved",
    desc: "Students apply for events; applications flow through the multi-level approval pipeline.",
  },
  {
    num: "04",
    title: "Participate & Track",
    desc: "Attend events, submit feedback, and track your complete participation history.",
  },
];

const stats = [
  { value: "4", label: "User Roles" },
  { value: "100%", label: "Responsive" },
  { value: "Real-time", label: "Notifications" },
  { value: "PDF/Excel", label: "Export Support" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">CEMS</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#roles" className="hover:text-foreground transition-colors">
              Roles
            </a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How It Works
            </a>
          </div>

          <Link to="/login">
            <Button className="gradient-primary text-primary-foreground">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 relative">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" /> College Event Management System
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
              Streamline Your College <span className="text-primary">Events</span> Like Never Before
            </h1>

            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              A modern, role-based platform for managing college events end-to-end — from creation and approval to participation and reporting.
              Built for Super Admins, Branch Admins, HODs, and Students.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="gradient-primary text-primary-foreground px-8 text-base">
                  Login to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="px-8 text-base">
                  Explore Features
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center p-4 rounded-xl bg-card shadow-card">
                <div className="text-2xl font-bold text-primary">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to manage college events efficiently, from creation to completion.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Card className="p-6 border-0 shadow-card hover:shadow-card-hover transition-shadow h-full">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Role-Based Dashboards</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Each user role gets a tailored dashboard with specific permissions and features.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((r, i) => (
              <motion.div
                key={r.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Card className="p-6 border-0 shadow-card hover:shadow-card-hover transition-shadow h-full">
                  <div className={`h-12 w-12 rounded-xl ${r.color} flex items-center justify-center mb-4`}>
                    <r.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{r.title}</h3>
                  <ul className="space-y-2">
                    {r.powers.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Simple 4-step process to manage events from start to finish.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-5xl font-extrabold text-primary/15 mb-3">{s.num}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="p-12 border-0 gradient-primary text-primary-foreground">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Event Management?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
              Login now and experience seamless event management across your entire institution.
            </p>
            <Link to="/login">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 px-8 text-base font-semibold"
              >
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg gradient-primary flex items-center justify-center">
              <Calendar className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">CEMS</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} College Event Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}