import { useTranslation } from "react-i18next";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import { RecoilRoot } from "recoil";
import MatchingPage from "./MatchingPage";
const App = () => {
  //const { initialized, keycloak } = useKeycloak();
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <BrowserRouter>
      <RecoilRoot>
        <Switch>
          <Route path="/">
            {/**initialized && keycloak && keycloak.authenticated ? (
            <h2>{t("test")}</h2>
          ) : (
            () => keycloak.login()
          )*/}
            <h2>{t("test")}</h2>
            <a href="/matching">matching page</a>
          </Route>
          <Route path="/matching" component={MatchingPage} exact />
        </Switch>
      </RecoilRoot>
    </BrowserRouter>
  );
};

export default App;
