import { ChangeEvent, FC, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/LayoutComponent/Layout";
import { Page, useNavigation } from "../utils/hooks/useNavigation";
import "../styles/SearchPage.styles.scss";
import { ReactComponent as ArrowIcon } from "../assets/icons/arrow_left.svg";
import { Result } from "../utils/search/Search.types";
import { useHistory } from "react-router";

const results: Result[] = [
  {
    _id: "1",
    email: "minh@email.com",
  },
  {
    _id: "2",
    email: "domenico@email.com",
  },
  {
    _id: "3",
    email: "nathalie@email.com",
  },
  {
    _id: "4",
    email: "bassam@email.com",
  },
  {
    _id: "5",
    email: "ines@email.com",
  },
  {
    _id: "6",
    email: "katharina@email.com",
  },
];

const friends = [
  {
    _id: 2,
    name: "Minh Vu Nguyen",
  },
  {
    _id: 3,
    name: "Domenico Ferrari",
  },
  {
    _id: 4,
    name: "Nathalie Fischer",
  },
  {
    _id: 5,
    name: "Katharina Böhm",
  },
  {
    _id: 6,
    name: "Bassam Mednini",
  },
  {
    _id: 7,
    name: "Ines Novak",
  },
];

const SearchPage: FC<{}> = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { currentLocation, onLocationChange } = useNavigation();
  const [searchValue, setSearchValue] = useState<string>("");
  const [focused, setFocused] = useState(false);

  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

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
              onChange={onSearch}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>
          <div className="search-page-search-results">
            {searchValue.length > 2 &&
              results
                .filter((result: any) =>
                  result.email.toLowerCase().includes(searchValue)
                )
                ?.map((result: any) => (
                  <div
                    key={result._id}
                    className="search-page-search-results-item"
                  >
                    <p className="search-page-search-results-item-label">
                      {result.email}
                    </p>
                  </div>
                ))}
          </div>
        </div>
        {!focused && (
          <div className="search-page-block">
            <h3>{t("general.pages.search.yourFriends")}</h3>
            {friends.map((item: any) => (
              <div key={item._id} className="search-page-search-results-item">
                <div className="search-page-search-results-item-pic"></div>
                <p className="search-page-search-results-item-label">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
