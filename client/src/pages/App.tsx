import { useTranslation } from "react-i18next";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { RecoilRoot } from "recoil";
const App = () => {
  //const { initialized, keycloak } = useKeycloak();
  const { t } = useTranslation();

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
          </Route>
        </Switch>
      </RecoilRoot>
    </BrowserRouter>
  );
};

export default App;
