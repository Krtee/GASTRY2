import { MessagePayload } from "@firebase/messaging";
import "leaflet/dist/leaflet.css";
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import { RecoilRoot, useRecoilValue } from "recoil";
import { generateNotification } from "../components/NotificationCardComponent/NotificationCardComponent";
import { PrivateRoute } from "../components/PrivateRoute";
import ProfileForm from "../components/ProfileForm/ProfileForm";
import UserSettings from "../components/UserSettings/UserSettings";
import { AxiosSubscriber } from "../utils/Axios.state";
import { onMessageListener } from "../utils/FirebaseUtil";
import { metaAdder } from "../utils/GeneralUtils";
import { currentMatchState } from "../utils/match/Match.state";
import { Match } from "../utils/match/Match.types";
import { NotificationType } from "../utils/notification/Notification.types";
import { UserSubscriber } from "../utils/user/UserSubscriber";
import BuddiesPage from "./BuddiesPage";
import BuddyProfilePage from "./BuddyProfilePage";
import ChooseFriendsPage from "./ChooseFriendsPage";
import FollowingsPage from "./FollowingsPage";
import MatchFoundPage from "./MatchFoundPage";
import MatchingPage from "./MatchingPage";
import MatchingStartpage from "./MatchingStartpage";
import NotificationPage from "./NotificationPage";
import ProfilePage from "./ProfilePage";
import RegisterPage from "./RegisterPage";
import SearchPage from "./SearchPage";
import TutorialPage from "./TutorialPage";

const App = () => {
  const currentMatch = useRecoilValue<Match | undefined>(currentMatchState);
  const history = useHistory();
  const payloadHandler = (payload: MessagePayload) => {
    generateNotification(
      payload.notification?.title || "",
      payload.notification?.body || "",
      (payload.data?.type as NotificationType) ||
        NotificationType.BUDDY_REQUEST,
      4000,
      payload.data?.type === NotificationType.MULTI_MATCH
        ? () => history.push(`/matching/result/${payload.data?.matchId}`)
        : payload.data?.type === NotificationType.BUDDY_REQUEST
        ? () => alert("IMPLEMET ROUTING TO FRIENDS PAGE")
        : () => alert("NO DEFAULT IMPLEMENT")
    );
  };

  onMessageListener(payloadHandler);

  metaAdder("apple-mobile-web-app-status-bar-style", "black-translucent");
  metaAdder("apple-touch-fullscreen", "yes");
  metaAdder("apple-mobile-web-app-title", "Yumatch");
  metaAdder("apple-mobile-web-app-capable", "yes");
  metaAdder("mobile-web-app-capable", "yes");

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
          <PrivateRoute
            path="/matching/addfriends"
            component={ChooseFriendsPage}
            exact
          />
          <PrivateRoute
            path="/profile/notifications"
            component={NotificationPage}
            exact
          />
          <Route path="/tutorial" component={TutorialPage} />
          <Route path="/register" component={RegisterPage} />
          <PrivateRoute path="/profile" component={ProfilePage} />
          <Route path="/user/:id" component={BuddyProfilePage} />
          <PrivateRoute path="/search" component={SearchPage} />
          <PrivateRoute path="/edit" component={ProfileForm} />
          <PrivateRoute path="/followings" component={FollowingsPage} />
          <PrivateRoute path="/buddies" component={BuddiesPage} />
        </Switch>
      </RecoilRoot>
    </BrowserRouter>
  );
};

export default App;
