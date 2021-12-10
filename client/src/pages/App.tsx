import { useKeycloak } from "@react-keycloak/web";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import { RecoilRoot, useRecoilState } from "recoil";
import { useAxios } from "../utils/AxiosUtil";
import { userState } from "../utils/user/User.state";
import { loadSingleUser } from "../utils/user/User.util";
import MatchingPage from "./MatchingPage";
import ProfilePage from "./ProfilePage";
import RegisterPage from "./RegisterPage";
import TutorialPage from "./TutorialPage";
const App = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { keycloak, initialized } = useKeycloak();
  const axios = useAxios();
  const [user, setUser] = useRecoilState(userState);

  /**
   * Helper method to load the backend user and customer as soon as keycloak is authenticated
   */
  useEffect(() => {
    if (initialized && keycloak.authenticated && axios && !user)
      keycloak
        .loadUserProfile()
        .then((profile) =>
          loadSingleUser((profile as any).attributes.serviceId[0], axios).then(
            (serverUser) => setUser(serverUser)
          )
        );
    // eslint-disable-next-line
  }, [keycloak, axios]);

  return (
    <BrowserRouter>
      <RecoilRoot>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/register" />
            {initialized && keycloak && keycloak.authenticated ? (
              <h2>{t("test")}</h2>
            ) : (
              () => keycloak.login()
            )}
            <h2>{t("test")}</h2>
          </Route>
          <Route path="/matching" component={MatchingPage} />
          <Route path="/tutorial" component={TutorialPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/profile" component={ProfilePage} />
        </Switch>
      </RecoilRoot>
    </BrowserRouter>
  );
};

export default App;
