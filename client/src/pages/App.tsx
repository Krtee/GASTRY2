import { useTranslation } from "react-i18next";
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import { RecoilRoot } from "recoil";
import MatchingPage from "./MatchingPage";
import ProfilePage from "./ProfilePage";
import RegisterPage from "./RegisterPage";
import TutorialPage from "./TutorialPage";
const App = () => {
  //const { initialized, keycloak } = useKeycloak();
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <BrowserRouter>
      <RecoilRoot>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/register" />
            {/**initialized && keycloak && keycloak.authenticated ? (
            <h2>{t("test")}</h2>
          ) : (
            () => keycloak.login()
          )*/}
            <h2>{t("test")}</h2>
          </Route>
          <Route path="/matching" component={MatchingPage} exact />
          <Route path="/tutorial" component={TutorialPage} exact />
          <Route path="/register" component={RegisterPage} exact />
          <Route path="/profile" component={ProfilePage} exact />
        </Switch>
      </RecoilRoot>
    </BrowserRouter>
  );
};

export default App;
