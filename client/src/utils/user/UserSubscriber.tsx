// export interface UserState {
//     instance: AxiosInstance | null;
//   }

import { useKeycloak } from "@react-keycloak/web";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { token } from "../FirebaseUtil";
import { useAxios } from "../AxiosUtil";
import { userState } from "./User.state";
import { User } from "./User.types";
import { createEmptyUser, loadSingleUser, updateUser } from "./User.util";

// mount this component under your application's root
// needed to use axios in selectors
// @author Domenico Ferrari
export const UserSubscriber: React.FC<{}> = () => {
  const [user, setUser] = useRecoilState<User>(userState);
  const { keycloak, initialized } = useKeycloak();
  //When merged replace with recoil axios state;
  const { axios } = useAxios();

  /**
   * Loads user from backend when authenticated via keycloak and
   */
  useEffect(() => {
    if (initialized && keycloak.authenticated && axios && !user.username)
      keycloak.loadUserProfile().then((profile) => {
        loadSingleUser((profile as any).attributes.serviceId[0], axios).then(
          (serverUser) => {
            setUser(serverUser);
          }
        );
      });

    return () => {
      setUser(createEmptyUser());
    };
  }, [keycloak, axios, initialized, setUser]);

  /**
   * Updating firebase token on backend user in case it changes
   */
  useEffect(() => {
    if (user.token === token || !axios || !token || !user.id) return;
    updateUser(axios, { ...user, token: token }).then((result) => {
      if (!result) return;
      setUser({ ...user, token: token });
    });
  }, [user.token, axios]);

  return <></>;
};
