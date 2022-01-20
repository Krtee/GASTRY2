import { atom, selector } from "recoil";
import { axiosState } from "../Axios.state";
import { User } from "../user/User.types";
import { loadMultipleUser } from "../user/User.util";
import { MultiMatchRequestStatus, MultiUserMatch } from "./MultiMatch.types";

export const currentMultiMatchState = atom<MultiUserMatch | undefined>({
  key: "currentMultiMatchState",
  default: undefined,
  dangerouslyAllowMutability: true,
});

export const getUserForMultiMatch = selector<User[]>({
  key: "getUserForMultiMatchSelector",
  get: async ({ get }) => {
    const { instance: axios } = get(axiosState);
    const multiUserMatch = get(currentMultiMatchState);
    if (!axios || axios === null || !multiUserMatch) {
      return [];
    }
    const usersToReturn = await loadMultipleUser(
      axios,
      multiUserMatch.userList
        .filter(
          (userToFilter) =>
            userToFilter.status !== MultiMatchRequestStatus.REJECTED
        )
        .map((userToMap) => userToMap.userId)
    );
    return usersToReturn || [];
  },
});
