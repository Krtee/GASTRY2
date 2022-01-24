import { FC, useEffect, useState } from "react";
import BuddyInfo from "../components/BuddyInfo/BuddyInfo";
import BuddyStats from "../components/BuddyStats/BuddyStats";
import { Page, useNavigation } from "../utils/hooks/useNavigation";
import "../styles/ProfilePage.styles.scss";
import ProfileNav from "../components/ProfileNav/ProfileNav";
import {
  Switch,
  Route,
  useRouteMatch,
  useParams,
  useHistory,
} from "react-router";
import Favorites from "../components/Favorites/Favorites";
import Layout from "../components/LayoutComponent/Layout";
import { loadSingleUser } from "../utils/user/User.util";
import { useAxios } from "../utils/AxiosUtil";
import { User } from "../utils/user/User.types";
import { ReactComponent as ArrowIcon } from "../assets/icons/arrow_left.svg";
import BuddyPosts from "../components/BuddyPosts/BuddyPosts";

const BuddyProfilePage: FC<{}> = () => {
  const { currentLocation, onLocationChange } = useNavigation();
  const { axios } = useAxios();
  const history = useHistory();
  const [user, setUser] = useState<User>();

  let { url } = useRouteMatch();
  let params: { id: string } = useParams();

  useEffect(() => {
    const getUserData = async () => {
      if (axios) {
        const data = await loadSingleUser(params?.id, axios);
        setUser(data);
      }
    };
    getUserData();
  }, [axios, params?.id]);

  return (
    <Layout
      navigationElements={Object.entries(Page).map((page) => ({
        title: page[1],
      }))}
      changeLocation={onLocationChange}
      currentLocation={currentLocation}
      header={{
        leftIconButton: {
          value: <ArrowIcon />,
          onClick: () => {
            history.goBack();
          },
        },
        title: `${user?.firstName} ${user?.lastName}`,
      }}
    >
      <div className="profile">
        <BuddyInfo buddy={user} />
        <BuddyStats
          posts={user?.posts?.length || 0}
          visitedRestaurants={user?.visitedRestaurants?.length || 0}
          followers={user?.subscribedRestaurants?.length || 0}
          followings={user?.buddies?.length || 0}
        />
        <ProfileNav />
        <Switch>
          <Route exact path={`${url}`}>
            <BuddyPosts />
          </Route>
          <Route path={`${url}/favorites`}>
            <Favorites />
          </Route>
        </Switch>
      </div>
    </Layout>
  );
};

export default BuddyProfilePage;
