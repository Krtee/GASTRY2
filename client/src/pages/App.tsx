import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { RecoilRoot } from "recoil";
import MatchingPage from "./MatchingPage";
import ProfilePage from "./ProfilePage";
import RegisterPage from "./RegisterPage";
import SearchPage from "./SearchPage";
import TutorialPage from "./TutorialPage";
const App = () => {
  return (
    <BrowserRouter>
      <RecoilRoot>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/matching" />
          </Route>
          <Route path="/matching" component={MatchingPage} />
          <Route path="/tutorial" component={TutorialPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/search" component={SearchPage} />
        </Switch>
      </RecoilRoot>
    </BrowserRouter>
  );
};

export default App;
