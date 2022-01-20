import { AxiosInstance } from "axios";
import { MultiMatchUserWrapper, MultiUserMatch } from "./MultiMatch.types";

export const createEmptyMultiUserMatch = (
  userId: string,
  userToAdd: MultiMatchUserWrapper[],
  currentMatchId: string
): MultiUserMatch => ({
  userList: userToAdd,
  createdAt: new Date(),
  updatedAt: new Date(),
  matches: [currentMatchId],
  creatorId: userId,
  matchedRestaurants: [],
  active: true,
});

export const postNewMultiUserMatch = (
  axios: AxiosInstance,
  multiUserMatch: MultiUserMatch
): Promise<MultiUserMatch> =>
  axios.post("/group/match/", multiUserMatch).then(({ data }) => data);
