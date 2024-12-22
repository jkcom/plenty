import { useAuthStore } from "../stores/auth";
import { useEffect } from "react";

interface AuthProviderProps {
  initialAccessToken: string | null;
  children: React.ReactNode;
}

export const AuthProvider = (props: AuthProviderProps) => {
  const authStore = useAuthStore();

  // Set initial
  useEffect(() => {
    if (props.initialAccessToken) {
      authStore.setAccessToken(props.initialAccessToken);
    }
  }, [props.initialAccessToken]);
  return <>{authStore.accessToken && <>{props.children}</>}</>;
};
