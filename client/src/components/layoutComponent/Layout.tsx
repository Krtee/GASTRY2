import React, { FC } from "react";
import { LayoutProps } from "./Layout.types";
import './LayoutStyles.scss';



const Layout: FC<LayoutProps> = ({
  children,
  navigationElements,
  changeLocation,
  currentLocation,
  header = "",
  hideHeader = false,
  hideBar = false

}) => {
  return <div id="layout-component">

    {!hideHeader && (
    <div id="layout-component-header">
    <h1>{header}</h1>
  </div>
    )}

      
    <div id="layout-component-content">
    {children}
    </div>


    {!hideBar && (
    <div id="layout-component-navigation-bar">
    {navigationElements && changeLocation &&
            navigationElements.map((navigation, index) => (
              <div
                key={index}
                onClick={() => changeLocation(index)}
                className={
                  currentLocation === index
                    ? "navigation-wrapper disabled"
                    : "navigation-wrapper"
                }
              >
                {navigation.icon}
                <p
                  className={
                    currentLocation === index
                      ? "navigation-node selected"
                      : "navigation-node"
                  }
                >
                  {navigation.title}
                </p>
              </div>
            ))}
    </div>

    )}



  </div>;
};

export default Layout;
