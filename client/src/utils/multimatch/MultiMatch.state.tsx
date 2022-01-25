import { atom, selector } from "recoil";
import { axiosState } from "../Axios.state";
import { currentMatchState } from "../match/Match.state";
import { userState } from "../user/User.state";
import { User } from "../user/User.types";
import { loadUsersForMultiMatchId } from "../user/User.util";
import { MultiUserMatch } from "./MultiMatch.types";
import { fetchMultiMatchForSingleMatchId } from "./MultiMatch.Utils";

/**
 * selector to fetch the latest Match
 * @author Minh
 */
export const latestMultiMatchSelector = selector<MultiUserMatch | undefined>({
  key: "latestMultiMatchSelector",
  get: async ({ get }) => {
    const { instance: axios } = get(axiosState);
    const currentSingleMatch = get(currentMatchState);
    const user = get(userState);

    if (
      !axios ||
      axios === null ||
      !user ||
      !user.activeMatch ||
      !currentSingleMatch?.partOfGroup
    ) {
      return undefined;
    }
    return await fetchMultiMatchForSingleMatchId(axios, user.activeMatch);
  },
});

/**
 * state of the current match
 */
export const currentMultiMatchState = atom<MultiUserMatch | undefined>({
  key: "currentMultiMatchState",
  default: latestMultiMatchSelector,
  dangerouslyAllowMutability: true,
});

/**
 * returns User for all users in multimatch
 */
export const getUserForMultiMatch = selector<User[]>({
  key: "getUserForMultiMatchSelector",
  get: async ({ get }) => {
    const { instance: axios } = get(axiosState);
    const multiUserMatch = get(currentMultiMatchState);
    if (!axios || axios === null || !multiUserMatch) {
      return [];
    }
    const usersToReturn = await loadUsersForMultiMatchId(
      axios,
      multiUserMatch.id!
    );
    return usersToReturn || [];
  },
});
