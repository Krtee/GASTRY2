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

const ProfilePage: FC<{}> = () => {
  const { t } = useTranslation();
  const { currentLocation, onLocationChange } = useNavigation(Page.PROFILE);
  const [selectedPage, setSelectedPage] = useState(nav_elements[0]);
  const [isEditing, setIsEditing] = useState(false);
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
        <ProfileForm userData={user} setIsEditing={setIsEditing} />
      ) : (
        <div className="profile">
          <UserInfo
            firstName={user.firstName}
            lastName={user.lastName}
            username={user.username}
          />
          <UserStats
            posts={user.posts ? user.posts.length : 0}
            // TODO: get real data when added to the api
            visitedRestaurants={0}
            followers={user.followers ? user.followers.length : 0}
            followings={user.followings ? user.followings.length : 0}
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
              <h1>posts</h1>
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
