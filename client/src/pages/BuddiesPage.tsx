import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { ReactComponent as ArrowIcon } from "../assets/icons/arrow_left.svg";
import ButtonComponent from "../components/ButtonComponent/ButtonComponent";
import Layout from "../components/LayoutComponent/Layout";
import Searchbar from "../components/Searchbar/Searchbar";
import { useAxios } from "../utils/AxiosUtil";
import { Page, useNavigation } from "../utils/hooks/useNavigation";
import { getUserForBuddiesSelector, userState } from "../utils/user/User.state";
import { BuddyType, User } from "../utils/user/User.types";
import { acceptBuddy, removeBuddy } from "../utils/user/User.util";
import "./../styles/BuddyPage.styles.scss";
const BuddiesPage: React.FC<{}> = () => {
  const navProps = useNavigation(Page.BUDDIES);
  const history = useHistory();
  const { t } = useTranslation();
  const [{ user }, setUser] = useRecoilState(userState);
  const [searchValue, setSearchValue] = useState("");
  const friends = useRecoilValue(getUserForBuddiesSelector);

  const { axios } = useAxios();

  /**
   * accepts friend requests
   * @auther Minh
   */
  const handleAcceptFriend = (buddyId: string) =>
    axios &&
    user &&
    acceptBuddy(axios, user.id!, buddyId).then(
      (result) =>
        result &&
        setUser((prevState) => ({
          user: {
            ...prevState.user!,
            buddies: prevState.user!.buddies.map((buddy) => {
              if (buddy.buddyId === buddyId) {
                return { ...buddy, buddyType: BuddyType.ACCEPTED };
              }
              return buddy;
            }),
          },
          loading: false,
        }))
    );

  const handleUnfollowFriend = async (buddyId: string) => {
    if (axios && user) {
      const isRemoved = await removeBuddy(axios, { userId: user.id!, buddyId });
      if (isRemoved) {
        setUser((prevState) => ({
          ...prevState,
          user: {
            ...prevState.user!,
            buddies: prevState.user!.buddies.filter(
              (buddy) => buddy.buddyId !== buddyId
            ),
          },
        }));
      }
    }
  };
  return (
    <Layout
      {...navProps}
      header={{
        leftIconButton: {
          value: <ArrowIcon />,
          onClick: () => {
            history.goBack();
          },
        },
        title: t("general.pages.profile.friends"),
      }}
      className="buddy-page"
    >
      <Searchbar value={searchValue} onChange={setSearchValue} placeholder="" />
      <p className="buddy-page__subheader">
        {t("general.pages.buddies.openFriendRequests")}
      </p>
      {user && (
        <div className="list">
          <div className="list-items-wrapper">
            {friends
              .filter(
                (friend) =>
                  user.buddies.find((buddy) => buddy.buddyId === friend.id)
                    ?.buddyType === BuddyType[BuddyType.INCOMING]
              )
              .map((buddy: User) => (
                <div key={buddy.id} className="list-item">
                  <p>{buddy.firstName}</p>
                  <ButtonComponent
                    onClick={() => handleAcceptFriend(buddy.id!)}
                    value={t("general.buttons.accept")}
                    size="mini"
                  />
                </div>
              ))}
          </div>
        </div>
      )}
      <span className="horizontal-line" />
      {user && (
        <div className="list">
          <div className="list-items-wrapper">
            {friends
              .filter(
                (friend) =>
                  user.buddies.find((buddy) => buddy.buddyId === friend.id)
                    ?.buddyType === BuddyType.ACCEPTED
              )
              .map((buddy: User) => (
                <div className="list-item">
                  <Link to={`/user/${buddy.id}`} key={buddy.id}>
                    <p>{`${buddy.firstName} ${buddy.lastName}`}</p>
                  </Link>
                  <button onClick={() => handleUnfollowFriend(buddy.id!)}>
                    {t("general.buttons.remove")}
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default BuddiesPage;
