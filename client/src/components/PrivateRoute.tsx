import { useKeycloak } from "@react-keycloak/web";
import { Redirect, Route } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../utils/user/User.state";

export const PrivateRoute: React.FC<{
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
}> = ({ component, path, exact }) => {
  const { initialized, keycloak } = useKeycloak();
  const { user, loading: userLoading } = useRecoilValue(userState);

  return (
    <>
      {initialized || !userLoading || !keycloak ? (
        user || keycloak.authenticated ? (
          <Route path={path} exact={exact} component={component} />
        ) : (
          <Redirect to={"/register"} />
        )
      ) : (
        <div>Loading</div>
      )}
    </>
  );
};
