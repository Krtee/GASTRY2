import "leaflet/dist/leaflet.css";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { AxiosSubscriber } from "../utils/Axios.state";
import MatchFoundPage from "./MatchFoundPage";
import MatchingPage from "./MatchingPage";
import NotificationPage from "./NotificationPage";
import ProfilePage from "./ProfilePage";
import RegisterPage from "./RegisterPage";
import TutorialPage from "./TutorialPage";

const App = () => {
  return (
    <BrowserRouter>
      <RecoilRoot>
        <AxiosSubscriber />
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
