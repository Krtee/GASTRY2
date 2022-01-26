import { atom, RecoilState, selector } from "recoil";
import { axiosState } from "../Axios.state";
import { userState } from "../user/User.state";
import { Match } from "./Match.types";
import { fetchMatchForId } from "./Match.Utils";

/**
 * selector to fetch the latest Match
 * @author Minh
 */
export const latestMatchSelector = selector<Match | undefined>({
  key: "latestMatchSelector",
  get: async ({ get }) => {
    const { instance: axios } = get(axiosState);
    const { user } = get(userState);
    if (!axios || axios === null || !user || !user.activeMatch) {
      return undefined;
    }
    const latestMatchResp = await fetchMatchForId(axios, user.activeMatch);
    if (latestMatchResp) {
      return latestMatchResp;
    }
  },
});

export const currentMatchState: RecoilState<Match | undefined> = atom<
  Match | undefined
>({
  key: "currentMatchState",
  default: latestMatchSelector,
  dangerouslyAllowMutability: true,
});
