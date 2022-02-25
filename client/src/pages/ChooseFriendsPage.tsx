import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ReactComponent as ArrowLeftIcon } from "../assets/icons/arrow_left.svg";
import { ReactComponent as CloseIcon } from "../assets/icons/close.svg";
import { ReactComponent as DoneIcon } from "../assets/icons/done.svg";
import userPlaceHolder from "../assets/images/placeHolderImage.png";
import ButtonComponent from "../components/ButtonComponent/ButtonComponent";
import CardComponent from "../components/CardComponent/CardComponent";
import Layout from "../components/LayoutComponent/Layout";
import SearchComponent from "../components/SearchComponent/SearchComponent";
import { useAxios } from "../utils/AxiosUtil";
import { Page, useNavigation } from "../utils/hooks/useNavigation";
import { currentMatchState } from "../utils/match/Match.state";
import {
  currentMultiMatchState,
  getUserForMultiMatch,
} from "../utils/multimatch/MultiMatch.state";
import { MultiMatchRequestStatus } from "../utils/multimatch/MultiMatch.types";
import {
  createEmptyMultiUserMatch,
  postNewMultiUserMatch,
} from "../utils/multimatch/MultiMatch.Utils";
import { getUserForBuddiesSelector, userState } from "../utils/user/User.state";
import { User, UserRole } from "../utils/user/User.types";
import "./../styles/ChooseFriendsStyles.scss";

interface ChooseFriendsPageProps {}

const ChooseFriendsPage: React.FC<ChooseFriendsPageProps> = () => {
  const navProps = useNavigation(Page.CHOOSE_FRIENDS, Page.MATCHING);
  const history = useHistory();
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const setMultiUserMatch = useSetRecoilState(currentMultiMatchState);
  const addedUsers = useRecoilValue(getUserForMultiMatch);
  const alphabet: string[] = Array.from("abcdefghijklmnopqrstuvwxyz");
  const [chosenFriends, setChosenFriends] = useState<User[]>(addedUsers);
  const { user } = useRecoilValue(userState);
  const buddyList = useRecoilValue(getUserForBuddiesSelector);
  const [filteredFriendlist, setFilteredFriendlist] = useState<User[]>(
    buddyList.map((userToMap) => ({
      ...userToMap,
      role: userToMap.role as UserRole,
    }))
  );
  const [currentMatch, setCurrentMatch] = useRecoilState(currentMatchState);
  const { axios } = useAxios();

  /**
   *sets  userlist, filtering the current user and all users, that do not have given searchstring included in their name
   @author Minh
   */
  useEffect(() => {
    setFilteredFriendlist(
      buddyList
        .map((userToMap) => ({
          ...userToMap,
          role: userToMap.role as UserRole,
        }))
        .filter(
          (userToFilter) =>
            userToFilter.id !== user!.id &&
            (userToFilter.email?.includes(searchText) ||
              userToFilter.firstName?.includes(searchText) ||
              userToFilter.lastName?.includes(searchText))
        )
    );
  }, [searchText, user, buddyList]);

  /**
   * creates new multiusermatch, and routes to the matching page
   */
  const handleSubmitMultiMatch = () => {
    if (user && user.id && currentMatch && currentMatch.id) {
      postNewMultiUserMatch(
        axios,
        createEmptyMultiUserMatch(
          user.id,
          chosenFriends.map((userToAdd) => ({
            userId: userToAdd.id!,
            status: MultiMatchRequestStatus.PENDING,
          })),
          currentMatch.id
        )
      ).then((mulitUserMatch) => {
        setMultiUserMatch(mulitUserMatch);
        setCurrentMatch((matchToUpdate) => ({
          ...matchToUpdate!,
          partOfGroup: true,
        }));
        history.push("/matching");
      });
    }
  };

  return (
    <Layout
      {...navProps}
      header={{
        leftIconButton: {
          value: <ArrowLeftIcon />,
          onClick: () => history.goBack(),
        },
        title: t("general.pages.addFriends.title"),
        rightIconButton: {
          value: <DoneIcon />,
          onClick: () => handleSubmitMultiMatch(),
        },
      }}
      className={"choose-friends"}
    >
      <SearchComponent value={searchText} onChange={setSearchText} />
      <div className={"choose-friends__chosen-friends__wrapper"}>
        {chosenFriends.map((user) => (
          <div>
            <div
              className={"choose-friends__chosen-friends"}
              onClick={() =>
                setChosenFriends(
                  chosenFriends.filter(
                    (userToFilter) => userToFilter.id !== user.id
                  )
                )
              }
            >
              <img
                src={userPlaceHolder}
                alt={user.username + " profile picture"}
              />
              <div className={"choose-friends__chosen-friends__close"}>
                <CloseIcon />
              </div>
            </div>
            <p>{user.username}</p>
          </div>
        ))}
      </div>
      <div className={"choose-friends__list"}>
        {alphabet.map((letter) => {
          const usersToRender = filteredFriendlist.filter(
            (userToFilter) =>
              userToFilter.firstName?.charAt(0).toLowerCase() === letter
          );
          return (
            usersToRender.length > 0 && (
              <div className={"choose-friends__letter-card__wrapper"}>
                <p>{letter.toUpperCase()}</p>
                <CardComponent
                  className={"choose-friends__friend-item__wrapper"}
                >
                  {usersToRender.map((user) => (
                    <div className={"choose-friends__friend-item"}>
                      <img
                        src={userPlaceHolder}
                        alt={user.username + " profile picture"}
                      />
                      <div className={"choose-friends__infos"}>
                        <p
                          className={"choose-friends__infos__name"}
                        >{`${user.firstName} ${user.lastName}`}</p>
                        <p className={"choose-friends__infos__username"}>
                          {user.username}
                        </p>
                      </div>
                      <ButtonComponent
                        value={t("general.pages.addFriends.button.addFriend")}
                        size="mini"
                        color="#F2594B"
                        onClick={() => {
                          setChosenFriends([
                            ...chosenFriends,
                            { ...user, role: user.role as UserRole },
                          ]);
                        }}
                        disabled={
                          !!chosenFriends.find(
                            (userToFind) => userToFind.id === user.id
                          )
                        }
                      />
                    </div>
                  ))}
                </CardComponent>
              </div>
            )
          );
        })}
      </div>
    </Layout>
  );
};

export default ChooseFriendsPage;
