import { AxiosInstance } from "axios";
import { MultiMatchUserWrapper, MultiUserMatch } from "./MultiMatch.types";

/**
 * creats an empty local {@link MultiUserMatch} with the given parameters
 * @param userId id of the current user
 * @param userToAdd userIds of users, that needs to be added
 * @param currentMatchId id of the current match
 * @returns a {@link MultiUserMatch}
 */
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

/**
 * POST API - to create new {@link MultiUserMatch}
 * @param axios axios instance
 * @param multiUserMatch {@link MultiUserMatch} that needs to be created
 * @returns newly created {@link MultiUserMatch} if successful, else returns undefined
 */
export const postNewMultiUserMatch = (
  axios: AxiosInstance,
  multiUserMatch: MultiUserMatch
): Promise<MultiUserMatch> =>
  axios.post("/data/group/match/", multiUserMatch).then(({ data }) => data);

/**
 * GET API - to fetch a multimatch for id
 * @param axios axios instance
 * @param userId id of the multimatch
 * @returns a multimatch if successful, else returns undefined
 * @author Minh
 */
export const fetchMultiMatchForSingleMatchId = (
  axios: AxiosInstance,
  matchId: string
): Promise<MultiUserMatch> =>
  axios
    .get("/data/group/match/singlematch/id", {
      params: { matchId: matchId },
    })
    .then(({ data }) => data)
    .catch(() => undefined);

export const checkIfMultiMatchisFinished = (
  axios: AxiosInstance,
  multimatchId: string
): Promise<boolean> =>
  axios
    .get("/data/group/match/finished", {
      params: { id: multimatchId },
    })
    .then(({ data }) => data)
    .catch(() => undefined);
