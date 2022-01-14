import { AxiosInstance } from "axios";
import { Geolocation } from "../hooks/useGeoLocation";
import { Match } from "./Match.types";
export const createEmptyMatch = (userId?: string): Match => ({
  userId: userId,
  createdAt: new Date(),
  updatedAt: new Date(),
  matchedMeals: [],
  unMatchedMeals: [],
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
  axios!
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
  newMatch: Match
): Promise<Match> =>
  axios
    .post("/data/match/update", newMatch)
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
  location: Geolocation
): Promise<Match> =>
  axios
    .post("/data/match/restaurant", {
      match: newMatch,
      location: location.coordinates,
    })
    .then((res) => res.data)
    .catch(() => undefined);
