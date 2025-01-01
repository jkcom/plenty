import { Link } from "./link";
import { MicroRouter, useRouter } from "./micro-router";
import { SyncProvider } from "sync";
import { PlentyRoot } from "./plenty-root";
import { usePoolStore } from "@/use-pool-store";

interface PlentyAppProps {
  initialContext?: App.Locals;
  initialUrl: string;
}
export const PlentyApp = (props: PlentyAppProps) => {
  const poolStore = usePoolStore({
    version: 1,
    accountId: props.initialContext?.account?.id,
    userId: props.initialContext?.user?.id,
    objectStores: [{ model: "post" }],
  });
  if (
    !props.initialContext?.account ||
    !props.initialContext?.user ||
    !poolStore.ready ||
    !poolStore.hydrationPool
  ) {
    return <h1>{"Missing context"}</h1>;
  }
  return (
    <SyncProvider
      hydrate={poolStore.hydrationPool}
      store={poolStore}
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
