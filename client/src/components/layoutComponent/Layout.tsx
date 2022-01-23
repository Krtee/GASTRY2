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
  withBackgroundImage = false,
}) => {
  return (
    <div
      id="layout-component"
      className={withBackgroundImage ? "with-background-image" : ""}
    >
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
                onClick={() => changeLocation?.(navigation.page)}
                className={
                  navigation.highlighted || currentLocation === navigation.page
                    ? "navigation-wrapper disabled"
                    : "navigation-wrapper"
                }
              >
                <div
                  className={
                    navigation.highlighted ||
                    currentLocation === navigation.page
                      ? "navigation-item focused"
                      : "navigation-item"
                  }
                >
                  {navigation.icon}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Layout;
