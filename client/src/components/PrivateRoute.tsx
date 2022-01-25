import { useKeycloak } from "@react-keycloak/web";
import { Route } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../utils/user/User.state";

export const PrivateRoute: React.FC<{
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
}> = ({ component, path, exact }) => {
  const { initialized, keycloak } = useKeycloak();
  const user = useRecoilValue(userState);
  return (
    <>
      {initialized ? (
        user || keycloak.authenticated ? (
          <Route path={path} exact={exact} component={component} />
        ) : (
          keycloak.login()
        )
      ) : (
        <div>Loading</div>
      )}
    </>
  );
};
