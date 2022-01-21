import { ReactElement } from "react";
import { IconButtonComponentProps } from "../IconButtonComponent/IconButtonComponent.types";
export interface LayoutProps {
  navigationElements?: NavigationElement[];
  changeLocation?(location: number): void;
  currentLocation?: number;
  header?: Header | string;
  hideBar?: boolean;
  className?: string;
}
export interface NavigationElement {
  title: string;
  icon?: ReactElement;
}

export interface Header {
  leftIconButton?: IconButtonComponentProps;
  title: string;
  rightIconButton?: IconButtonComponentProps;
}
