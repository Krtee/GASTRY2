import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { RecoilRoot } from "recoil";
import ProfileForm from "../components/ProfileForm/ProfileForm";
import FollowersPage from "./FollowersPage";
import FollowingsPage from "./FollowingsPage";
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
          <Route path="/edit" component={ProfileForm} />
          <Route path="/followings" component={FollowingsPage} />
          <Route path="/followers" component={FollowersPage} />
        </Switch>
      </RecoilRoot>
    </BrowserRouter>
  );
};

export default App;
