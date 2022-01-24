import { FC } from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import { useRecoilState } from "recoil";
import Favorites from "../components/Favorites/Favorites";
import Layout from "../components/LayoutComponent/Layout";
import Posts from "../components/Posts/Posts";
import ProfileNav from "../components/ProfileNav/ProfileNav";
import UserInfo from "../components/UserInfo/UserInfo";
import UserSettings from "../components/UserSettings/UserSettings";
import UserStats from "../components/UserStats/UserStats";
import "../styles/ProfilePage.styles.scss";
import { Page, useNavigation } from "../utils/hooks/useNavigation";
import { userState } from "../utils/user/User.state";

const ProfilePage: FC<{}> = () => {
  const navProps = useNavigation(Page.PROFILE);
  const [user, setUser] = useRecoilState(userState);

  let { url } = useRouteMatch();

  return (
    <Layout
      {...navProps}
      header={{
        title: `${user?.firstName} ${user?.lastName}`,
      }}
    >
      <div className="profile">
        <UserInfo user={user} />
        <UserStats
          posts={user?.posts?.length || 0}
          visitedRestaurants={user?.visitedRestaurants?.length || 0}
          followers={user?.subscribedRestaurants?.length || 0}
          followings={user?.buddies?.length || 0}
        />
        <ProfileNav ownsProfile />
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
