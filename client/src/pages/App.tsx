import { MessagePayload } from "@firebase/messaging";
import "leaflet/dist/leaflet.css";
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import { RecoilRoot } from "recoil";
import { generateNotification } from "../components/NotificationCardComponent/NotificationCardComponent";
import { AxiosSubscriber } from "../utils/Axios.state";
import { onMessageListener } from "../utils/FirebaseUtil";
import { NotificationType } from "../utils/notification/Notification.types";
import { UserSubscriber } from "../utils/user/UserSubscriber";
import MatchFoundPage from "./MatchFoundPage";
import MatchingPage from "./MatchingPage";
import NotificationPage from "./NotificationPage";
import ProfilePage from "./ProfilePage";
import RegisterPage from "./RegisterPage";
import TutorialPage from "./TutorialPage";

const App = () => {
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

  return (
    <BrowserRouter>
      <RecoilRoot>
        <AxiosSubscriber />
        <UserSubscriber />
        <Switch>
          <Route path="/" exact>
            <Redirect to="/matching" />
          </Route>
          <Route path="/matching" component={MatchingPage} exact />
          <Route path="/matching/result/:id" component={MatchFoundPage} exact />
          <Route path="/tutorial" component={TutorialPage} exact />
          <Route path="/register" component={RegisterPage} exact />
          <Route path="/profile" component={ProfilePage} exact />
          <Route
            path="/profile/notifications"
            component={NotificationPage}
            exact
          />
          <Route path="/">
            <Redirect to="/matching" />
          </Route>
        </Switch>
      </RecoilRoot>
    </BrowserRouter>
  );
};

export default App;
