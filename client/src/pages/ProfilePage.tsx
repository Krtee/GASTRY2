import { FC } from "react";
import UserInfo from "../components/UserInfo/UserInfo";
import UserStats from "../components/UserStats/UserStats";
import { Page, useNavigation } from "../utils/hooks/useNavigation";
import "../styles/ProfilePage.styles.scss";
import ProfileNav from "../components/ProfileNav/ProfileNav";
import { Switch, Route, useRouteMatch } from "react-router";
import { useRecoilState } from "recoil";
import { userState } from "../utils/user/User.state";
import UserSettings from "../components/UserSettings/UserSettings";
import Posts from "../components/Posts/Posts";
import Favorites from "../components/Favorites/Favorites";
import Layout from "../components/LayoutComponent/Layout";

const ProfilePage: FC<{}> = () => {
  const { currentLocation, onLocationChange } = useNavigation(Page.PROFILE);
  const [user, setUser] = useRecoilState(userState);

  let { url } = useRouteMatch();

  return (
    <Layout
      navigationElements={Object.entries(Page).map((page) => ({
        title: page[1],
      }))}
      changeLocation={onLocationChange}
      currentLocation={currentLocation}
    >
      <div className="profile">
        <UserInfo />
        <UserStats
          posts={user.posts ? user.posts.length : 0}
          // TODO: get real data when added to the api
          visitedRestaurants={0}
          followers={user.followers ? user.followers.length : 0}
          followings={user.followings ? user.followings.length : 0}
        />
        <ProfileNav />
        <Switch>
          <Route exact path={`${url}`}>
            <Posts />
          </Route>
          <Route path={`${url}/settings`}>
            <UserSettings />
          </Route>
          <Route path={`${url}/favorites`}>
            <Favorites />
          </Route>
        </Switch>
      </div>
    </Layout>
  );
};

export default ProfilePage;
