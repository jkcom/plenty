import { useBrowserSyncStore } from "@/hooks/browser-sync-store";
import { SyncProvider } from "sync";
import { Link } from "./link";
import { MicroRouter, useRouter } from "./micro-router";
import { PlentyRoot } from "./plenty-root";
import { useAuthStore } from "@/stores/auth";
import { AuthProvider } from "./auth-provider";

interface PlentyAppProps {
  initialContext?: App.Locals;
  initialUrl: string;
}
export const PlentyApp = (props: PlentyAppProps) => {
  const authStore = useAuthStore();
  const syncStore = useBrowserSyncStore({
    version: 2,
    accountId: props.initialContext?.account?.id,
    userId: props.initialContext?.user?.id,
  });
  if (!props.initialContext?.account || !props.initialContext?.user) {
    return <h1>{"Missing context"}</h1>;
  }
  return (
    <AuthProvider initialAccessToken={props.initialContext.accessToken}>
      <SyncProvider
        accessToken={authStore.accessToken!}
        store={syncStore}
        user={props.initialContext.user}
        account={props.initialContext.account}
      >
        <MicroRouter
          baseSegments={["p", props.initialContext.account.slug]}
          initialPath={props.initialUrl}
        >
          <InnerApp />
        </MicroRouter>
      </SyncProvider>
    </AuthProvider>
  );
};

const InnerApp = () => {
  const {
    compilePath,
    path: [, , , page],
  } = useRouter();
  return (
    <div className="flex h-full">
      <div className="border-r w-[150px] flex flex-col fixed top-8 bottom-0">
        <div className="flex-1"></div>
        <div className="border-t p-2 py-4">
          <small className="text-xs block">Admin</small>
          <div>
            <Link href={compilePath("users")}>{"Users"}</Link>
          </div>
          <div>
            <Link href={compilePath("settings")}>{"Settings"}</Link>
          </div>
        </div>
      </div>
      <div className="ml-[150px] mt-8">
        {(() => {
          switch (page) {
            case "settings":
              return <h1>{"Setting"}</h1>;
            case "users":
              return <h1>{"Users"}</h1>;
            default:
              return <PlentyRoot />;
          }
        })()}
      </div>
    </div>
  );
};
