import { ReactNode } from "react";

type AppInitializerProps = {
  children: ReactNode;
};

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {

  return children;
};

export default AppInitializer;