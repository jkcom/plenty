import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface UserMenuProps {
  user: {
    picture: string;
  };
}
export const UserMenu = (props: UserMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div
          className="w-5 h-5 rounded-full bg-contain"
          style={{
            backgroundImage: `url(${props.user.picture}`,
          }}
        ></div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/log-out">Log out</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
