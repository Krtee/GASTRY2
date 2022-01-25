import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import {
  LayoutProps,
  NavigationElement,
} from "../../components/LayoutComponent/Layout.types";
import { currentMatchState } from "../match/Match.state";
import { Match } from "../match/Match.types";
import { userState } from "../user/User.state";
import { ReactComponent as HomeIcon } from "./../../assets/icons/home.svg";
import { ReactComponent as MatchIcon } from "./../../assets/icons/matching_page_icon.svg";
import { ReactComponent as ProfileIcon } from "./../../assets/icons/profile.svg";
/**
 * All Pages that can be navigated to using Navigationbar
 * <<CAUTION>> THE ORDER OF THIS ENUMS DEFINES THE NAVIGATION <<CAUTION>>
 */
export enum Page {
  FEED = "FEED",
  MATCHING = "MATCHING",
  MATCHING_START = "MATCHING_START",
  PROFILE = "PROFILE",
  MATCH_FOUND = "MATCH_FOUND",
  CHOOSE_FRIENDS = "CHOOSE_FRIENDS",
  NOTIFICATION = "NOTIFICATION",
  PROFILE_FORM = "PROFILE_FORM",
  BUDDIES = "BUDDIES",
  BUDDY_PROFILE = "BUDDY_PROFILE",
  FOLLOWINGS = "FOLLOWINGS",
  SEARCH = "SEARCH",
}

export interface NavigationPage {
  title: string;
  page: Page;
  route: string;
  icon?: JSX.Element;
}

/**
 * custom hook for navigation
 * @param location current Page
 * @returns
 */
export const useNavigation = (
  location: Page,
  highlight?: Page
): LayoutProps => {
  const { t } = useTranslation();
  const [currentLocation, setCurrentLocation] = useState<Page>(location);
  const history = useHistory();
  const currentMatch = useRecoilValue<Match | undefined>(currentMatchState);
  const user = useRecoilValue(userState);
  const navigationItems: NavigationElement[] = [
    {
      title: t("general.navigation.FEED"),
      page: Page.FEED,
      icon: <HomeIcon />,
      highlighted: currentLocation === Page.FEED || highlight === Page.FEED,
    },
    {
      title: t("general.navigation.MATCHING"),
      page: Page.MATCHING,
      icon: <MatchIcon />,
      highlighted:
        currentLocation === Page.MATCHING || highlight === Page.MATCHING,
    },
    {
      title: t(`general.navigation.profile`),
      page: Page.PROFILE,
      icon: <ProfileIcon />,
      highlighted:
        currentLocation === Page.PROFILE || highlight === Page.PROFILE,
    },
  ];

  useEffect(() => {
    switch (currentLocation) {
      case Page.FEED:
        //history.push("/feed");
        break;
      case Page.MATCHING:
        if (currentMatch) {
          history.push("/matching");
        } else {
          history.push("/matching/start");
        }
        break;

      case Page.PROFILE:
        history.push("/profile");
        break;
      default:
    }
    // eslint-disable-next-line
  }, [currentLocation, history, user]);
  return {
    currentLocation,
    changeLocation: (newLocation) => {
      setCurrentLocation(newLocation);
    },
    navigationElements: navigationItems,
  };
};
