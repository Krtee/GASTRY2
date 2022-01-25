import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { useRecoilValue } from "recoil";
import { ReactComponent as ArrowIcon } from "../assets/icons/arrow_left.svg";
import ButtonComponent from "../components/ButtonComponent/ButtonComponent";
import Layout from "../components/LayoutComponent/Layout";
import List from "../components/List/List";
import Searchbar from "../components/Searchbar/Searchbar";
import { useAxios } from "../utils/AxiosUtil";
import { Page, useNavigation } from "../utils/hooks/useNavigation";
import { getUserForBuddiesSelector, userState } from "../utils/user/User.state";
import { Buddy, BuddyType, User } from "../utils/user/User.types";
import { acceptBuddy } from "../utils/user/User.util";
import "./../styles/BuddyPage.styles.scss";
const BuddiesPage: React.FC<{}> = () => {
  const navProps = useNavigation(Page.BUDDIES);
  const history = useHistory();
  const { t } = useTranslation();
  const { user } = useRecoilValue(userState);
  const [searchValue, setSearchValue] = useState("");
  const friends = useRecoilValue(getUserForBuddiesSelector);
  const { axios } = useAxios();

  /**
   * accepts friend requests
   * @auther Minh
   */
  const handleAcceptFriend = (buddy: Buddy) =>
    axios &&
    user &&
    acceptBuddy(axios, user.id!, buddy.buddyId, {
      ...buddy,
      buddyType: BuddyType.ACCEPTED,
    });
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
      {user && (
        <div className="list">
          <div className="list-items-wrapper">
            {friends
              .filter(
                (friend) =>
                  user.buddies.find((buddy) => buddy.buddyId === friend.id)
                    ?.buddyType === BuddyType.INCOMING
              )
              .map((buddy: User) => (
                <div key={buddy.id} className="list-item">
                  <p>{buddy.firstName}</p>
                  <ButtonComponent
                    onClick={() => handleAcceptFriend}
                    value=""
                    size="mini"
                  />
                </div>
              ))}
          </div>
        </div>
      )}
      <span className="horizontal-line" />
      {user && (
        <List
          onDeleteItem={() => {}}
          deleteBtnLabel="Unfollow"
          data={friends.filter(
            (friend) =>
              user.buddies.find((buddy) => buddy.buddyId === friend.id)
                ?.buddyType === BuddyType.ACCEPTED
          )}
          column="firstName"
        />
      )}
    </Layout>
  );
};

export default BuddiesPage;
