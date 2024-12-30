import { useRouter } from "./micro-router";

interface LinkProps {
  href: string;
  children: React.ReactNode;
}
export const Link = (props: LinkProps) => {
  const { navigate } = useRouter();
  return (
    <a
      className="hover:underline text-primary text-sm"
      onClick={(e) => {
        e.preventDefault();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        navigate({ path: props.href });
      }}
      href={props.href}
    >
      {props.children}
    </a>
  );
};
