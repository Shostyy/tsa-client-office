import { LucideIcon } from "lucide-react";

export interface LinkCategory {
  name: string;
  icon: LucideIcon;
  href: string;
  children?: never;
}

export interface ParentCategory {
  name: string;
  icon: LucideIcon;
  href?: never;
  children: LinkCategory[];
}

export type Category = LinkCategory | ParentCategory;

export function isLinkCategory(category: Category): category is LinkCategory {
  return "href" in category && category.href !== undefined;
}

export function isParentCategory(
  category: Category
): category is ParentCategory {
  return "children" in category && category.children !== undefined;
}
