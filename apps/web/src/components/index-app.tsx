import { AccountList } from "./account-list";
import { AuthProvider } from "./auth-provider";

interface IndexAppProps {
  initialAccessToken: string;
}

const IndexApp = (props: IndexAppProps) => {
  return (
    <AuthProvider initialAccessToken={props.initialAccessToken}>
      <div>
        <h1>Index App</h1>
        <AccountList />
      </div>
    </AuthProvider>
  );
};
export default IndexApp;
