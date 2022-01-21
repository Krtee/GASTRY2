import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { UserRole } from "../user/User.types";
import { userState } from "../user/User.state";
import { useRecoilValue } from "recoil";
import { NavigationElement } from "../../components/LayoutComponent/Layout.types";

/**
 * All Pages that can be navigated to using Navigationbar
 * <<CAUTION>> THE ORDER OF THIS ENUMS DEFINES THE NAVIGATION <<CAUTION>>
 */
export enum Page {
  FEED = "FEED",
  MATCHING = "MATCHING",
  PROFILE = "PROFILE",
  MATCH_FOUND = "MATCH_FOUND",
  NOTIFICATION = "NOTIFICATION"
}

export interface NavigationPage {
  title: string;
  page: Page;
  route: string;
}

/**
 * custom hook for navigation
 * @param location current Page
 * @returns
 */
export const useNavigation = (
  location?: Page
): {
  currentLocation?: Page;
  onLocationChange(location: Page, props?: any): void;
  passedProps?: any;
  navItems: NavigationElement[];
} => {
  const { t } = useTranslation();
  const [currentLocation, setCurrentLocation] = useState<Page>();
  const user = useRecoilValue(userState);
  const [passedProps, setPassedProps] = useState(undefined);
  const history = useHistory();

  const navigationItems: NavigationElement[] = [
    {
      title: t("general.navigation.PROFILE"),
      page: Page.PROFILE,
    },
    {
      title: t("general.navigation.MATCHING"),
      page: Page.MATCHING,
      main: true,
    },
    {
      title: t("general.navigation.FEED"),
      page: Page.FEED,
    },
  ];

  /**
   * returns a list of Pages which can be visited by the user, depending on the UserRole
   */
  const getNavigationForUserRole = useCallback((): Map<Page, string> => {
    const availableNavigation = new Map<Page, string>();
    availableNavigation.set(Page.MATCHING, "/matching");
    availableNavigation.set(Page.FEED, "/feed");
    availableNavigation.set(Page.PROFILE, "/profile");
    return availableNavigation;
  }, []);

  /**
   * set current location to the current Page
   */
  useEffect(() => {
    if (location !== undefined && getNavigationForUserRole().has(location)) {
      setCurrentLocation(location);
    }
  }, [location, getNavigationForUserRole]);

  /**
   * navigates to listed Pages on location change
   */
  useEffect(() => {
    const navigationForUserRole = getNavigationForUserRole();
    if (
      currentLocation === undefined ||
      !navigationForUserRole.has(currentLocation)
    )
      return;
    const route: string | undefined =
      navigationForUserRole.get(currentLocation);
    if (route) {
      history.push(route, passedProps);
    }
    // eslint-disable-next-line
  }, [currentLocation]);

  return {
    currentLocation,
    onLocationChange: (location, props) => {
      props && setPassedProps(props);
      setCurrentLocation(location);
    },
    passedProps: history.location.state,
    navItems: navigationItems,
  };
};
