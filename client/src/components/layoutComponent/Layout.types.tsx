import { ReactElement } from "react";
export interface LayoutProps {
  navigationElements?: NavigationElement[];
  changeLocation?(location: number): void;
  currentLocation?: number;
}
export interface NavigationElement {
  title: string;
  icon?: ReactElement;
}
