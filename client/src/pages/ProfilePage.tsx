import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/layoutComponent/Layout";
import UserInfo from "../components/UserInfo/UserInfo";
import UserStats from "../components/UserStats/UserStats";
import { Page, useNavigation } from "../utils/hooks/useNavigation";
import "../styles/ProfilePage.styles.scss";
import ProfileNav, { nav_elements } from "../components/ProfileNav/ProfileNav";
import { Switch, Route, useRouteMatch } from "react-router";
import UserPosts from "../components/UserPosts/UserPosts";
import ProfileForm from "../components/ProfileForm/ProfileForm";
import { useRecoilState } from "recoil";
import { userState } from "../utils/user/User.state";

const data = {
  userId: "123",
  photo: "",
  name: "Fadel Kaadan",
  username: "fadeleus",
  address: "Maxi / Stuttgart",
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
  const [isEditing, setIsEditing] = useState(false);
  // TODO: replace dummy data with user data
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
      {isEditing ? (
        <ProfileForm
          userId={data.userId}
          photo={data.photo}
          name={data.name}
          address={data.address}
          favRestaurant={data.fav_restaurant}
          setIsEditing={setIsEditing}
        />
      ) : (
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
              onClick={() => setIsEditing(true)}
            >
              {t("general.pages.profile.editProfile")}
            </button>
          </div>
          <ProfileNav
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
          />
          <Switch>
            <Route exact path={`${url}`}>
              <UserPosts posts={data.posts} />
            </Route>
            <Route path={`${url}/favorites`}>
              <h1>favorites</h1>
            </Route>
          </Switch>
        </div>
      )}
    </Layout>
  );
};

export default ProfilePage;
