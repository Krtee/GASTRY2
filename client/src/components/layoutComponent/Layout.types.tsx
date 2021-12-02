import { ReactElement } from "react";
export interface LayoutProps {
  navigationElements?: NavigationElement[];
  changeLocation?(location: number): void;
  currentLocation?: number;
  header?: string;
  hideHeader?: boolean;
  hideBar?: boolean;
}
export interface NavigationElement {
  title: string;
  icon?: ReactElement;
}
