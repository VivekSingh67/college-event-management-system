import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { GraduationCap, Eye, EyeOff } from "lucide-react";

import loginIllustration from "../assets/login-illustration.png";

const roles = [
  { value: "super_admin", label: "Super Admin" },
  { value: "branch_admin", label: "Branch Admin" },
  { value: "hod", label: "HOD" },
  { value: "student", label: "Student" },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, role);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Illustration (visible on large screens) */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden items-center justify-center p-12">
        <div className="relative z-10 text-center space-y-6 max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-14 w-14 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-primary-foreground">CEMS</h1>
          </div>

          <img
            src={loginIllustration}
            alt="College Event Management System Illustration"
            className="rounded-2xl shadow-2xl mx-auto max-h-[400px] object-cover"
          />

          <h2 className="text-2xl font-bold text-primary-foreground">
            College Event Management System
          </h2>
          <p className="text-primary-foreground/80 text-base">
            Manage events, track participation, and streamline college activities — all in one place.
          </p>
        </div>

        {/* Decorative background circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-primary-foreground/5" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary-foreground/5" />
      </div>

      {/* Right - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile-only logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-4">
            <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-primary">CEMS</h1>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selection */}
            <div className="space-y-2">
              <Label>Login As</Label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                      role === r.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:border-primary/40"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold gradient-primary border-0"
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Demo: Select a role and click Sign In
          </p>
        </div>
      </div>
    </div>
  );
}