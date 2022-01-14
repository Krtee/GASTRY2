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

export const postNewMatch = (
  axios: AxiosInstance,
  match: Match
): Promise<Match | undefined> =>
  axios!
    .post("/data/match/", match)
    .then(({ data }) => data)
    .catch(() => undefined);

export const getOrCreateMatch = async (
  axios?: AxiosInstance,
  userId?: string
) => {
  if (!axios || axios === null || !userId) {
    return createEmptyMatch("");
  }
  const latestMatchResp = await fetchLatestMatchForUser(axios, userId);
  if (latestMatchResp) {
    return latestMatchResp;
  } else {
    const newMatchResp = await postNewMatch(axios, createEmptyMatch(userId));
    if (newMatchResp) {
      return newMatchResp;
    }
  }
  return createEmptyMatch(userId);
};

export const updateMatch = (
  axios: AxiosInstance,
  newMatch: Match
): Promise<Match> =>
  axios
    .post("/data/match/update", newMatch)
    .then((res) => res.data)
    .catch(() => undefined);

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
