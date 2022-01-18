import { ReactElement } from "react";
export interface LayoutProps {
  navigationElements?: NavigationElement[];
  changeLocation?(location: number): void;
  currentLocation?: number;
  header?: string;
  hideHeader?: boolean;
  hideBar?: boolean;
  className?: string;
}
export interface NavigationElement {
  title: string;
  icon?: ReactElement;
}
