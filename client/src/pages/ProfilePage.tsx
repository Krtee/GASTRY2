import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch } from "react-router";
import Layout from "../components/LayoutComponent/Layout";
import ProfileNav, { nav_elements } from "../components/ProfileNav/ProfileNav";
import UserInfo from "../components/UserInfo/UserInfo";
import UserPosts from "../components/UserPosts/UserPosts";
import UserStats from "../components/UserStats/UserStats";
import "../styles/ProfilePage.styles.scss";
import { Page, useNavigation } from "../utils/hooks/useNavigation";

const data = {
  photo: "",
  name: "Fadel Kaadan",
  username: "fadeleus",
  fav_restaurant: "Büffel und Koi",
  visitedRestaurantsCount: 13,
  postsCount: 30,
  followers: 26,
  followings: 55,
  posts: ["", "", "", "", ""],
};

const ProfilePage: FC<{}> = () => {
  const { t } = useTranslation();
  const { currentLocation, onLocationChange } = useNavigation(Page.PROFILE);
  const [selectedPage, setSelectedPage] = useState(nav_elements[0]);
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
        <UserInfo
          photo={data.photo}
          name={data.name}
          username={data.username}
          fav_restaurant={data.fav_restaurant}
        />
        <UserStats
          visitedRestaurants={data.visitedRestaurantsCount}
          posts={data.postsCount}
          followers={data.followers}
          followings={data.followings}
        />
        <div className="profile-interactions">
          <button
            className="profile-interactions-element profile-edit-btn"
            onClick={() => {}}
          >
            {t("general.pages.profile.editProfile")}
          </button>
          <input
            type="text"
            placeholder={t("general.pages.profile.searchFriends")}
            className="profile-interactions-element profile-search-input"
          />
        </div>
        <ProfileNav
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
        <Switch>
          <Route path={`${url}/posts`}>
            <UserPosts posts={data.posts} />
          </Route>
          <Route path={`${url}/settings`}>
            <h1>settings</h1>
          </Route>
          <Route path={`${url}/favorites`}>
            <h1>favorites</h1>
          </Route>
          <Route path={`${url}/mail`}>
            <h1>mail</h1>
          </Route>
        </Switch>
      </div>
    </Layout>
  );
};

export default ProfilePage;
