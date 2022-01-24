import { atom, RecoilState, selector } from "recoil";
import { axiosState } from "../Axios.state";
import { BuddyType, User } from "./User.types";
import { loadMultipleUser } from "./User.util";

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
    const usersToReturn = await loadMultipleUser(
      axios,
      currentUser.buddies
        .filter((userToFilter) => userToFilter.buddyType === BuddyType.ACCEPTED)
        .map((userToMap) => userToMap.buddyId)
    );
    return usersToReturn || [];
  },
});
