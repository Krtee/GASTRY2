// export interface UserState {
//     instance: AxiosInstance | null;
//   }

import { useKeycloak } from "@react-keycloak/web";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { useAxios } from "../AxiosUtil";
import { token } from "../FirebaseUtil";
import { userState } from "./User.state";
import { loadSingleUser, updateUser } from "./User.util";

// mount this component under your application's root
// needed to use axios in selectors
// @author Domenico Ferrari
export const UserSubscriber: React.FC<{}> = () => {
  const [{ user }, setUser] = useRecoilState(userState);
  const { keycloak, initialized } = useKeycloak();
  //When merged replace with recoil axios state;
  const { axios } = useAxios();

  /**
   * Loads user from backend when authenticated via keycloak and
   */
  useEffect(() => {
    if (initialized && keycloak.authenticated && axios && !user?.username)
      setUser((prevState) => ({ ...prevState, loading: true }));
    keycloak.loadUserProfile().then(
      (profile) =>
        axios &&
        loadSingleUser((profile as any).attributes.serviceId[0], axios).then(
          (serverUser) => {
            setUser({ user: serverUser, loading: false });
          }
        )
    );

    return () => {
      setUser({ user: undefined, loading: false });
    };
    // eslint-disable-next-line
  }, [keycloak, axios, initialized, setUser]);

  /**
   * Updating firebase token on backend user in case it changes
   */
  useEffect(() => {
    if (user?.token === token || !axios || !token || !user?.id) return;
    updateUser(axios, { ...user, token: token }).then((result) => {
      if (!result) return;
      setUser({ user: { ...user, token: token }, loading: false });
    });
    // eslint-disable-next-line
  }, [user?.token, axios]);

  return <></>;
};
