import { atom, RecoilState, selector } from "recoil";
import { axiosState } from "../Axios.state";
import { User } from "./User.types";
import { loadFriends } from "./User.util";

export const userState: RecoilState<User | undefined> = atom<User | undefined>({
  key: "currentUser",
  default: undefined,
});

/**
 * returns User for all users in multimatch
 */
export const getUserForBuddiesSelector = selector<User[]>({
  key: "getUserForBuddiesSelector",
  get: async ({ get }) => {
    const { instance: axios } = get(axiosState);
    const currentUser = get(userState);
    if (!axios || axios === null || !currentUser) {
      return [];
    }
    const usersToReturn = await loadFriends(axios, currentUser.id);
    return usersToReturn || [];
  },
});
