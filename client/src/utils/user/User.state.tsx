import { atom, RecoilState, selector } from "recoil";
import { axiosState } from "../Axios.state";
import { User } from "./User.types";
import { loadFriends } from "./User.util";

export const userState: RecoilState<{
  user: User | undefined;
  loading: boolean;
  error?: any;
}> = atom<{
  user: User | undefined;
  loading: boolean;
  error?: any;
}>({
  key: "currentUser",
  default: {
    user: undefined,
    loading: false,
  },
});

/**
 * returns User for all users in multimatch
 */
export const getUserForBuddiesSelector = selector<User[]>({
  key: "getUserForBuddiesSelector",
  get: async ({ get }) => {
    const { instance: axios } = get(axiosState);
    const { user } = get(userState);
    if (!axios || axios === null || !user) {
      return [];
    }
    const usersToReturn = await loadFriends(axios, user.id!);
    return usersToReturn || [];
  },
});
