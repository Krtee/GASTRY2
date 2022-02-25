import { ChangeEvent, FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { ReactComponent as ArrowIcon } from "../assets/icons/arrow_left.svg";
import Layout from "../components/LayoutComponent/Layout";
import "../styles/SearchPage.styles.scss";
import { useAxios } from "../utils/AxiosUtil";
import { Page, useNavigation } from "../utils/hooks/useNavigation";
import { userState } from "../utils/user/User.state";
import { User } from "../utils/user/User.types";
import {
  addBuddy,
  fetchAllUsers,
  getFriendRequestStatus,
} from "../utils/user/User.util";

const SearchPage: FC<{}> = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { axios } = useAxios();
  const { user } = useRecoilValue(userState);
  const navProps = useNavigation(Page.SEARCH);
  const [searchValue, setSearchValue] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (axios) {
        const allUsers = await fetchAllUsers(axios);
        if (allUsers) {
          setUsers(allUsers);
        }
      }
    };
    fetchUsers();
  }, [axios]);

  const handleAddBuddy = async (buddyId: string) => {
    if (!user) return;
    await addBuddy(axios, { userId: user.id!, buddyId });
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
        title: t("general.pages.profile.searchFriends"),
      }}
    >
      <div className="search-page">
        <div className="search-page-search">
          <div className="search-page-search-input">
            <span className="search-page-search-input-icon"></span>
            <input
              className="search-page-search-input-element"
              placeholder={t("general.pages.search.findNameOrEmail")}
              value={searchValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchValue(e.target.value)
              }
              autoFocus
            />
          </div>
          <div className="search-page-search-results">
            {searchValue.length > 0 &&
              users
                ?.filter((result) => {
                  return (
                    (result.email?.toLowerCase().includes(searchValue) ||
                      result.firstName?.toLowerCase().includes(searchValue) ||
                      result.lastName?.toLowerCase().includes(searchValue)) &&
                    result.id !== user?.id
                  );
                })
                ?.map((result) => (
                  <Link
                    key={result.id}
                    to={`/user/${result.id}`}
                    className="search-page-search-results-item"
                  >
                    <p>{result.email}</p>
                    {!!getFriendRequestStatus(user!, result.id!) ? (
                      <button
                        className="button-inactive"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                      >
                        {t("general.pages.search.added")}
                      </button>
                    ) : (
                      <button
                        className="button-active"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          handleAddBuddy(result.id!);
                        }}
                      >
                        {t("general.pages.search.add")}
                      </button>
                    )}
                  </Link>
                ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
