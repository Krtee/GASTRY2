import { useKeycloak } from "@react-keycloak/web";
import { FC, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useAxios } from "../../utils/AxiosUtil";
import { userState } from "../../utils/user/User.state";
import { loadSingleUser } from "../../utils/user/User.util";
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
  const { axios } = useAxios();
  const [user, setUser] = useRecoilState(userState);
  const { keycloak, initialized } = useKeycloak();

  /**
   * Helper method to load the backend user as soon as keycloak is authenticated
   * @author Domenico Ferrari
   */
  useEffect(() => {
    if (initialized && keycloak.authenticated && axios && !user?.username) {
      keycloak
        .loadUserProfile()
        .then((profile) =>
          loadSingleUser((profile as any).attributes.serviceId[0], axios).then(
            (serverUser) => setUser(serverUser)
          )
        );
    }

    // eslint-disable-next-line
  }, [keycloak, axios, user]);

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
