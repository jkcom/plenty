import { Link } from "./link";
import { MicroRouter, useRouter } from "./micro-router";

interface PlentyAppProps {
  initialContext?: App.Locals;
  initialUrl: string;
}
export const PlentyApp = (props: PlentyAppProps) => {
  if (!props.initialContext?.account) {
    return <h1>{"Missing context"}</h1>;
  }
  return (
    <MicroRouter
      baseSegments={["p", props.initialContext.account.slug]}
      initialPath={props.initialUrl}
    >
      <InnerApp />
    </MicroRouter>
  );
};

const InnerApp = () => {
  const {
    compilePath,
    path: [, , , page],
  } = useRouter();
  return (
    <div className="p-2">
      <Link href={compilePath("settings")}>{"Settings"}</Link>
      <Link href={compilePath("about")}>{"About"}</Link>
      {(() => {
        switch (page) {
          case "settings":
            return <h1>{"Setting"}</h1>;
          case "about":
            return <h1>{"About"}</h1>;
        }
      })()}
    </div>
  );
};
