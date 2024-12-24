import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./auth-provider";
import { CreateAccount } from "./create-account";

// Create a client
const queryClient = new QueryClient();

interface IndexAppProps {
  initialAccessToken: string | null;
}

const IndexApp = (props: IndexAppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider initialAccessToken={props.initialAccessToken}>
        <CreateAccount />
      </AuthProvider>
    </QueryClientProvider>
  );
};
export default IndexApp;
