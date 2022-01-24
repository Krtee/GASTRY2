import "leaflet/dist/leaflet.css";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { RecoilRoot, useRecoilValue } from "recoil";
import { AxiosSubscriber } from "../utils/Axios.state";
import { currentMatchState } from "../utils/match/Match.state";
import { Match } from "../utils/match/Match.types";
import { UserSubscriber } from "../utils/user/UserSubscriber";
import BuddyProfilePage from "./BuddyProfilePage";
import ChooseFriendsPage from "./ChooseFriendsPage";
import MatchFoundPage from "./MatchFoundPage";
import MatchingPage from "./MatchingPage";
import MatchingStartpage from "./MatchingStartpage";
import NotificationPage from "./NotificationPage";
import ProfilePage from "./ProfilePage";
import RegisterPage from "./RegisterPage";
import SearchPage from "./SearchPage";
import TutorialPage from "./TutorialPage";
import ProfileForm from "../components/ProfileForm/ProfileForm";
import Buddies from "./BuddiesPage";
import FollowingsPage from "./FollowingsPage";

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
          <Route
            path="/profile/notifications"
            component={NotificationPage}
            exact
          />
          <Route path="/tutorial" component={TutorialPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/user/:id" component={BuddyProfilePage} />
          <Route path="/search" component={SearchPage} />
          <Route path="/edit" component={ProfileForm} />
          <Route path="/followings" component={FollowingsPage} />
          <Route path="/buddies" component={Buddies} />
        </Switch>
      </RecoilRoot>
    </BrowserRouter>
  );
};

export default App;
