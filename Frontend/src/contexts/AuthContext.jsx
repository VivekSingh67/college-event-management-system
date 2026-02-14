import React, { createContext, useContext, useState } from "react";

// ────────────────────────────────────────────────
// Export UserRole so you can use it everywhere
// ────────────────────────────────────────────────
export const UserRole = {
  SUPER_ADMIN:   "super_admin",
  BRANCH_ADMIN:  "branch_admin",
  HOD:           "hod",
  STUDENT:       "student",
};

// You can also create a helper array if you need to show dropdowns / lists
export const allUserRoles = [
  UserRole.SUPER_ADMIN,
  UserRole.BRANCH_ADMIN,
  UserRole.HOD,
  UserRole.STUDENT,
];

const AuthContext = createContext(undefined);

const mockUsers = {
  [UserRole.SUPER_ADMIN]: {
    id: "1",
    name: "Dr. Rajesh Kumar",
    email: "admin@college.edu",
    role: UserRole.SUPER_ADMIN,
  },
  [UserRole.BRANCH_ADMIN]: {
    id: "2",
    name: "Prof. Anita Sharma",
    email: "branch@college.edu",
    role: UserRole.BRANCH_ADMIN,
    branch: "Engineering",
  },
  [UserRole.HOD]: {
    id: "3",
    name: "Dr. Vikram Singh",
    email: "hod@college.edu",
    role: UserRole.HOD,
    branch: "Engineering",
    department: "Computer Science",
  },
  [UserRole.STUDENT]: {
    id: "4",
    name: "Vivek Patel",
    email: "vivek@college.edu",
    role: UserRole.STUDENT,
    branch: "Engineering",
    department: "Computer Science",
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (_email, _password, role) => {
    // In real app → replace with actual API call
    const foundUser = mockUsers[role] || null;
    setUser(foundUser);
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}