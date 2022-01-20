import { FC } from "react";
import IconButtonComponent from "../IconButtonComponent/IconButtonComponent";
import { LayoutProps } from "./Layout.types";
import "./LayoutStyles.scss";

const Layout: FC<LayoutProps> = ({
  children,
  navigationElements,
  changeLocation,
  currentLocation,
  header = "",
  hideBar = false,
  className,
}) => {
  return (
    <div id="layout-component">
      {!!header && (
        <div id="layout-component-header">
          {typeof header !== "string" && header.leftIconButton ? (
            <IconButtonComponent filled {...header.leftIconButton} />
          ) : (
            <span className="layout-component-header__button-placeholder" />
          )}
          <h1 className={"layout-component-header__title"}>
            {typeof header === "string" ? header : header.title}
          </h1>
          {typeof header !== "string" && header.rightIconButton ? (
            <IconButtonComponent filled {...header.rightIconButton} />
          ) : (
            <span className="layout-component-header__button-placeholder" />
          )}
        </div>
      )}

      <div id="layout-component-content" className={className || ""}>
        {children}
      </div>

      {!hideBar && (
        <div id="layout-component-navigation-bar">
          {navigationElements &&
            navigationElements.map((navigation, index) => (
              <div
                key={index}
                onClick={() => changeLocation?.(index)}
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
    </div>
  );
};

export default Layout;
