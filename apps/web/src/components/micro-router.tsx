import React, {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Define the shape of the context
interface MicroRouterContextType {
  path: string[];
  navigate: (options: { path: string }) => void;
  baseSegments: string[];
}

// Create the context with a default value (optional)
const MicroRouterContext = createContext<MicroRouterContextType | undefined>(
  undefined,
);

export const useRouter = () => {
  const context = useContext(MicroRouterContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return {
    ...context,
    compilePath: (...segments: string[]) => {
      return "/" + [...context.baseSegments, ...segments].join("/");
    },
  };
};

export const usePathSegments = (): string[] => {
  const { path } = useRouter();
  return path;
};

// Create the provider component
export const MicroRouter: React.FC<{
  children: ReactNode;
  initialPath: string;
  baseSegments: string[];
}> = ({ children, initialPath, baseSegments }) => {
  const [path, setPath] = useState<string[]>(initialPath.split("/"));
  const navigate: MicroRouterContextType["navigate"] = (options) => {
    history.replaceState(null, "", options.path);
  };

  useEffect(() => {
    onUrlChange((url) => {
      const path = url.split(window.location.origin)[1];
      setPath(path.split("/"));
    });
  }, []);

  return (
    <MicroRouterContext.Provider value={{ path, navigate, baseSegments }}>
      {children}
    </MicroRouterContext.Provider>
  );
};

type HistoryMethod = "pushState" | "replaceState";

function onUrlChange(callback: (url: string) => void) {
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  const wrapHistoryMethod = (method: HistoryMethod) => {
    const originalMethod =
      method === "pushState" ? originalPushState : originalReplaceState;
    return function (this: History, ...args: any[]) {
      const result = originalMethod.apply(this, args);
      callback(window.location.href);
      return result;
    };
  };

  history.pushState = wrapHistoryMethod("pushState");
  history.replaceState = wrapHistoryMethod("replaceState");

  window.addEventListener("popstate", () => {
    callback(window.location.href);
  });
}
