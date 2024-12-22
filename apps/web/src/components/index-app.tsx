import { AuthProvider } from "./auth-provider";
import { CreateAccount } from "./create-account";

interface IndexAppProps {
  initialAccessToken: string | null;
}

const IndexApp = (props: IndexAppProps) => {
  return (
    <AuthProvider initialAccessToken={props.initialAccessToken}>
      <CreateAccount />
    </AuthProvider>
  );
};
export default IndexApp;
