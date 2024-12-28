import { useRouter } from "./micro-router";

interface LinkProps {
  href: string;
  children: React.ReactNode;
}
export const Link = (props: LinkProps) => {
  const { navigate } = useRouter();
  return (
    <a
      onClick={(e) => {
        e.preventDefault();
        navigate({ path: props.href });
      }}
      href={props.href}
    >
      {props.children}
    </a>
  );
};
