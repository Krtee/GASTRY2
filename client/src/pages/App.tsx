import "leaflet/dist/leaflet.css";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { RecoilRoot } from "recoil";
import ProfileForm from "../components/ProfileForm/ProfileForm";
import Buddies from "./BuddiesPage";
import FollowingsPage from "./FollowingsPage";
import { AxiosSubscriber } from "../utils/Axios.state";
import MatchFoundPage from "./MatchFoundPage";
import MatchingPage from "./MatchingPage";
import ProfilePage from "./ProfilePage";
import RegisterPage from "./RegisterPage";
import SearchPage from "./SearchPage";
import TutorialPage from "./TutorialPage";
import BuddyProfilePage from "./BuddyProfilePage";

const App = () => {
  return (
    <BrowserRouter>
      <RecoilRoot>
        <AxiosSubscriber />
        <Switch>
          <Route path="/" exact>
            <Redirect to="/matching" />
          </Route>
          <Route path="/matching" component={MatchingPage} />
          <Route path="/matching/result/:id" component={MatchFoundPage} exact />
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
