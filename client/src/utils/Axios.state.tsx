import { useKeycloak } from "@react-keycloak/web";
import axios, { AxiosInstance } from "axios";
import { FC, useEffect } from "react";
import { atom, RecoilState, useSetRecoilState } from "recoil";

export interface AxiosState {
  instance: AxiosInstance | null;
}

export const axiosState: RecoilState<AxiosState> = atom<AxiosState>({
  key: "axios",
  default: { instance: null },
});

// mount this component under your application's root
// needed to use axios in selectors
// @author Minh
export const AxiosSubscriber: FC<{}> = () => {
  const setAxiosState = useSetRecoilState(axiosState);
  const { keycloak, initialized } = useKeycloak();
  const baseURL = process.env.REACT_APP_SERVICE_URL;

  useEffect(() => {
    const instance = axios.create({
      baseURL,
      headers: {
        Authorization: initialized ? `Bearer ${keycloak.token}` : undefined,
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    setAxiosState({ instance: instance });

    return () => {
      setAxiosState({ instance: null });
    };
  }, [baseURL, initialized, keycloak, keycloak.token, setAxiosState]);

  return <></>;
};
