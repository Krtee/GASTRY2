import { useKeycloak } from "@react-keycloak/web";
import { useState, useEffect } from "react";
import axios, { AxiosInstance } from "axios";

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
  const { keycloak, initialized } = useKeycloak();
  const [axiosInstance, setAxiosInstance] = useState({});
  const baseURL = process.env.REACT_APP_SERVICE_URL;

  useEffect(() => {
    const instance = axios.create({
      baseURL,
      headers: {
        Authorization: initialized ? `Bearer ${keycloak.token}` : undefined,
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    setAxiosInstance({ instance });

    return () => {
      setAxiosInstance({});
    };
  }, [baseURL, initialized, keycloak, keycloak.token]);

  return (axiosInstance as any).instance as AxiosInstance;
};
