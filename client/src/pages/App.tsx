import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { RecoilRoot } from "recoil";
import MatchingPage from "./MatchingPage";
import ProfilePage from "./ProfilePage";
import RegisterPage from "./RegisterPage";
import TutorialPage from "./TutorialPage";
const App = () => {
  return (
    <BrowserRouter>
      <RecoilRoot>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/matching" />
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
