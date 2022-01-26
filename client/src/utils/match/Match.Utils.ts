import { AxiosInstance } from "axios";
import { Coordinates } from "../hooks/useGeoLocation";
import { GoogleMapsResponseRestaurant, Match } from "./Match.types";

/**
 * creates an empty match object
 * @param userId id of user
 * @returns {@link Match}
 * @author Minh
 */
export const createEmptyMatch = (userId?: string): Match => ({
  userId: userId,
  createdAt: new Date(),
  updatedAt: new Date(),
  matchedMeals: [],
  unmatchedMeals: [],
  matchedRestaurants: [],
});

/**
 * GET API - to fetch the latest match for user
 * @param axios axios instance
 * @param userId id of the current user
 * @returns a match if successful, else returns undefined
 * @author Minh
 */
export const fetchLatestMatchForUser = (
  axios: AxiosInstance,
  userId: string
): Promise<Match | undefined> =>
  axios
    .get("/data/match/user/latest/id", {
      params: { userId: userId! },
    })
    .then(({ data }) => data)
    .catch(() => undefined);

/**
 * GET API - to fetch a match for id
 * @param axios axios instance
 * @param userId id of the match
 * @returns a match if successful, else returns undefined
 * @author Minh
 */
export const fetchMatchForId = (
  axios: AxiosInstance,
  matchId: string
): Promise<Match> =>
  axios
    .get("/data/match/id", {
      params: { id: matchId },
    })
    .then(({ data }) => data)
    .catch(() => undefined);

/**
 * POST API - to post a new match
 * @param axios axios instance
 * @param match to create
 * @returns created Match if successful, else returns undefined
 * @author Minh
 */
export const postNewMatch = (
  axios: AxiosInstance,
  match: Match
): Promise<Match | undefined> =>
  axios
    .post("/data/match/", match)
    .then(({ data }) => data)
    .catch(() => undefined);

/**
 *   POST API - to update an existing match
 * @param axios axios instance
 * @param newMatch match to update
 * @returns updated Match
 * @author Minh
 */
export const updateMatch = (
  axios: AxiosInstance,
  newMatch: Match,
  coords: Coordinates
): Promise<Match> =>
  axios
    .post("/data/match/update", {
      match: newMatch,
      location: coords,
    })
    .then((res) => res.data)
    .catch(() => undefined);

/**
 * POST API - to get matching Restaurant for given match
 * @param axios axios instance
 * @param newMatch match object, whre restaurants should be matched
 * @param location geolocation of use
 * @returns update Match
 * @author Minh
 */
export const matchRestaurants = (
  axios: AxiosInstance,
  newMatch: Match,
  coords: Coordinates
): Promise<Match> =>
  axios
    .post("/data/match/restaurant", {
      match: newMatch,
      location: coords,
    })
    .then((res) => res.data)
    .catch(() => undefined);

/**
 * GET API - to fetch infos of a restaurant
 * @param axios axios instance
 * @param placeId id of restaurant
 * @returns {@link GoogleMapsResponseRestaurant}
 * @author Minh
 */
export const getRestaurantInfo = (
  axios: AxiosInstance,
  placeId: string
): GoogleMapsResponseRestaurant =>
  axios
    .get("/data/restaurant/info", { params: { restaurantId: placeId } })
    .then((res) => res.data)
    .catch(() => undefined);
