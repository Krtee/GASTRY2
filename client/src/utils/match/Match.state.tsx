import { atom, RecoilState, selector } from "recoil";
import { axiosState } from "../Axios.state";
import { userState } from "../user/User.state";
import { Match } from "./Match.types";
import {
  createEmptyMatch,
  fetchLatestMatchForUser,
  postNewMatch,
} from "./Match.Utils";

/**
 * selector to fetch the latest Match
 * @author Minh
 */
export const latestMatchSelector = selector<Match>({
  key: "latestMatchSelector",
  get: async ({ get }) => {
    const { instance: axios } = get(axiosState);
    const user = get(userState);
    if (!axios || axios === null || !user) {
      return createEmptyMatch("");
    }
    const latestMatchResp = await fetchLatestMatchForUser(axios, user.id);
    if (latestMatchResp) {
      return latestMatchResp;
    } else {
      const newMatchResp = await postNewMatch(axios, createEmptyMatch(user.id));
      if (newMatchResp) {
        return newMatchResp;
      }
    }
    return createEmptyMatch("");
  },
});

export const currentMatchState: RecoilState<Match> = atom<Match>({
  key: "currentMatchState",
  default: latestMatchSelector,
});
