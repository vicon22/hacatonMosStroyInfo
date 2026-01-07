import { JSX, memo } from "react";
import cn from "classnames";
import { Button } from "@gravity-ui/uikit";
import st from "./nav.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavProps = {
  className?: string;
  links: {
    icon: JSX.Element;
    title: string;
    href: string;
  }[];
};

export const Nav = memo(function Nav(props: NavProps) {
  const path = usePathname();

  return (
    <ul className={cn(st.links, props.className)}>
      {props.links.map((item) => (
        <li key={item.href}>
          <Link href={item.href}>
            <Button
              selected={
                item.href.length === 1
                  ? item.href === path
                  : path.includes(item.href)
              }
              className={st.button}
              view="flat"
              size="xl"
              pin="brick-brick"
              width="max"
            >
              {item.icon}
              {item.title}
            </Button>
          </Link>
        </li>
      ))}
    </ul>
  );
});
