import { useKeycloak } from "@react-keycloak/web";
import axios, { AxiosInstance } from "axios";
import { useEffect, useState } from "react";

/**
 * An enum containing different types of Responses
 * @author Domenico Ferrari
 */
export enum ResponseTypes {
  SUCCESSFUL = "SUCCESSFUL",
  REGISTER_ERROR = "REGISTER_ERROR",
  LOGIN_ERROR = "LOGIN_ERROR",
  REGISTER_USER_EXISTS_MAIL = "REGISTER_USER_EXISTS_MAIl",
  REGISTER_USER_EXISTS_USERNAME = "REGISTER_USER_EXISTS_USERNAME",
}

/**
 * Creates a prefconfigured axios wrapper that also talks with
 * the keycloak instance.
 */
export const useAxios = () => {
  const { keycloak, initialized: authInitialized } = useKeycloak();
  const [axiosInstance, setAxiosInstance] = useState({});
  const baseURL = process.env.REACT_APP_SERVICE_URL;
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    const instance = axios.create({
      baseURL,
      headers: {
        Authorization: authInitialized ? `Bearer ${keycloak.token}` : undefined,
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    setAxiosInstance({ instance });
    setInitialized(true);

    return () => {
      setAxiosInstance({});
      setInitialized(false);
    };
  }, [baseURL, authInitialized, keycloak, keycloak.token]);

  return {
    axios: (axiosInstance as any).instance as AxiosInstance,
    initialized: initialized,
  };
};
