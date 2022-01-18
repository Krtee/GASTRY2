import { useKeycloak } from "@react-keycloak/web";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next/";
import { useRecoilState } from "recoil";
import { useAxios } from "../../utils/AxiosUtil";
import { userState } from "../../utils/user/User.state";
import { loadSingleUser } from "../../utils/user/User.util";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { LayoutProps } from "./Layout.types";
import "./LayoutStyles.scss";

const Layout: FC<LayoutProps> = ({
  children,
  navigationElements,
  changeLocation,
  currentLocation,
  header = "",
  hideHeader = false,
  hideBar = false,
  className,
}) => {
  const { axios } = useAxios();
  const [user, setUser] = useRecoilState(userState);
  const { t } = useTranslation();
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
      {!hideHeader && (
        <div id="layout-component-header">
          <h1>{header}</h1>

          <ButtonComponent
            value={
              user?.username
                ? t("general.buttons.logout")
                : t("general.buttons.login")
            }
            onClick={
              user?.username ? () => keycloak.logout() : () => keycloak.login()
            }
          />
        </div>
      )}

      <div id="layout-component-content" className={className || ""}>
        {children}
      </div>

      {!hideBar && (
        <div id="layout-component-navigation-bar">
          {navigationElements &&
            changeLocation &&
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
    </div>
  );
};

export default Layout;
