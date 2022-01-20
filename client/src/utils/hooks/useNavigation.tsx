import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { LayoutProps } from "../../components/LayoutComponent/Layout.types";
import { userState } from "../user/User.state";
import { UserRole } from "../user/User.types";

/**
 * All Pages that can be navigvated to using Navigationbar
 * <<CAUTION>> THE ORDER OF THIS ENUMS DEFINES THE NAVIGATION <<CAUTION>>
 */
export enum Page {
  FEED = "FEED",
  MATCHING = "MATCHING",
  PROFILE = "PROFILE",
  MATCH_FOUND = "MATCH_FOUND",
}

export interface NavigationPage {
  title: string;
  page: Page;
  route: string;
}

export interface NavigationHook extends LayoutProps {
  onLocationChange(location: number, props?: any): void;
  passedProps?: any;
}

/**
 * custom hook for navigation
 * @param location current Page
 * @returns
 */
export const useNavigation = (location?: Page): NavigationHook => {
  const { t } = useTranslation();
  const [currentLocation, setCurrentLocation] = useState<number>();
  const user = useRecoilValue(userState);

  const [passedProps, setPassedProps] = useState(undefined);
  const history = useHistory();
  const allNavigationPages: NavigationPage[] = [
    {
      title: t(`general.navigation.feed`),
      page: Page.FEED,
      route: "/feed",
    },
    {
      title: t(`general.navigation.matching`),
      page: Page.MATCHING,
      route: "/matching",
    },
    {
      title: t(`general.navigation.profile`),
      page: Page.PROFILE,
      route: "/profile",
    },
  ];

  /**
   * returns a list of Pages which can be visited by the user, depending on the UserRole
   */
  const getNavigationForUserRole = useCallback((): Page[] => {
    if (user) {
      switch (user.role) {
        case UserRole.ADMIN:
        case UserRole.USER:
          return [Page.MATCHING];
      }
    }
    return [];
  }, [user]);

  /**
   * set current location to the current Page
   */
  useEffect(() => {
    if (location !== undefined) {
      setCurrentLocation(getNavigationForUserRole().indexOf(location));
    }
  }, [location, getNavigationForUserRole]);

  /**
   * navigates to listed Pages on location change
   */
  useEffect(() => {
    if (
      currentLocation === undefined ||
      getNavigationForUserRole()[currentLocation] === undefined
    ) {
      return;
    }
    const route = allNavigationPages.find(
      (navigationEntry) =>
        navigationEntry.page === getNavigationForUserRole()[currentLocation]
    )?.route;
    if (route) {
      history.push(route, passedProps);
    }
    // eslint-disable-next-line
  }, [currentLocation]);

  return {
    currentLocation,
    changeLocation: (location) => setCurrentLocation(location),
    onLocationChange: (location, props) => {
      props && setPassedProps(props);
      setCurrentLocation(location);
    },
    navigationElements: allNavigationPages.map((page) => ({
      title: page.title,
    })),
    passedProps: history.location.state,
  };
};
