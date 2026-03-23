import { createContext, useContext, useState } from "react";

const RoleContext = createContext({ role: "student", setRole: () => {} });

export function RoleProvider({ children }) {
  const [role, setRole] = useState("super-admin");
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
}

export const useRole = () => useContext(RoleContext);
