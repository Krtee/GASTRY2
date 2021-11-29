import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../state/User/User.state";
import { UserRole } from "../state/User/User.types";

/**
 * All Pages that can be navigvated to using Navigationbar
 * <<CAUTION>> THE ORDER OF THIS ENUMS DEFINES THE NAVIGATION <<CAUTION>>
 */
export enum Page {
  MATCHING = "MATCHING",
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
  currentLocation?: number;
  onLocationChange(location: number, props?: any): void;
  passedProps?: any;
} => {
  const { t } = useTranslation();
  const [currentLocation, setCurrentLocation] = useState<number>();
  const user = useRecoilValue(userState);

  const [passedProps, setPassedProps] = useState(undefined);
  const history = useHistory();
  const allNavigationPages: NavigationPage[] = [
    {
      title: t(`general.pages.matching`),
      page: Page.MATCHING,
      route: "/matching",
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
    onLocationChange: (location, props) => {
      props && setPassedProps(props);
      setCurrentLocation(location);
    },
    passedProps: history.location.state,
  };
};
