import "leaflet/dist/leaflet.css";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { RecoilRoot, useRecoilValue } from "recoil";
import { AxiosSubscriber } from "../utils/Axios.state";
import { currentMatchState } from "../utils/match/Match.state";
import { Match } from "../utils/match/Match.types";
import { UserSubscriber } from "../utils/user/UserSubscriber";
import ChooseFriendsPage from "./ChooseFriendsPage";
import MatchFoundPage from "./MatchFoundPage";
import MatchingPage from "./MatchingPage";
import MatchingStartpage from "./MatchingStartpage";
import NotificationPage from "./NotificationPage";
import ProfilePage from "./ProfilePage";
import RegisterPage from "./RegisterPage";
import TutorialPage from "./TutorialPage";

const App = () => {
  const currentMatch = useRecoilValue<Match | undefined>(currentMatchState);

  return (
    <BrowserRouter>
      <RecoilRoot>
        <AxiosSubscriber />
        <UserSubscriber />
        <Switch>
          <Route path="/" exact>
            {currentMatch ? (
              <Redirect to="/matching" />
            ) : (
              <Redirect to="/matching/start" />
            )}
          </Route>
          <Route path="/matching/start" component={MatchingStartpage} exact />
          <Route path="/matching" component={MatchingPage} exact />
          <Route path="/matching/result/:id" component={MatchFoundPage} exact />
          <Route
            path="/matching/addfriends"
            component={ChooseFriendsPage}
            exact
          />
          <Route path="/tutorial" component={TutorialPage} exact />
          <Route path="/register" component={RegisterPage} exact />
          <Route path="/profile" component={ProfilePage} exact />
          <Route
            path="/profile/notifications"
            component={NotificationPage}
            exact
          />
        </Switch>
      </RecoilRoot>
    </BrowserRouter>
  );
};

export default App;
