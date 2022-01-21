import { ReactElement } from "react";
import { Page } from "../../utils/hooks/useNavigation";
import { IconButtonComponentProps } from "../IconButtonComponent/IconButtonComponent.types";
export interface LayoutProps {
  navigationElements?: NavigationElement[];
  changeLocation?(location: Page): void;
  currentLocation?: Page;
  header?: Header | string;
  hideBar?: boolean;
  className?: string;
}
export interface NavigationElement {
  title: string;
  page: Page;
  main?: boolean;
  icon?: ReactElement;
}

export interface Header {
  leftIconButton?: IconButtonComponentProps;
  title: string;
  rightIconButton?: IconButtonComponentProps;
}
