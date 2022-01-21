import { AxiosInstance } from "axios";
import { ResponseTypes } from "../AxiosUtil";
import { User, UserRole } from "./User.types";

/**
 * Helper function to create an empty user for modification
 * @returns an instance of user {@link User}
 * @author Domenico Ferrari
 */
export const createEmptyUser = (): User => {
  return {
    id: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    role: UserRole.USER,
    token: "",
  };
};

/**
 * API method to create a new user {@link User}
 * @param axios
 * @returns boolean for either successful creation or failed one
 * @author Domenico Ferrari
 */
export const createNewUser = async (
  axios: AxiosInstance,
  newUser: User
): Promise<ResponseTypes> => {
  return axios
    .post("/user/", newUser)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error while creating a new user!");
      return error.response.data;
    });
};

/**
 * API method to load an {@link User} by its id
 *
 * @param userId The id of the {@link User} to fetch
 * @param axios The axios instance
 * @returns Either the loaded user or undefined in case of an error
 * @author Domenico Ferrari
 */
export const loadSingleUser = async (
  userId: string,
  axios: AxiosInstance
): Promise<User> => {
  return axios
    .get("/user/id/", { params: { userId: userId } })
    .then((resp) => resp.data)
    .catch((exc) => console.error("Error during user load!", exc));
};

/**
 * API method to load an {@link User} by its id
 *
 * @param userId The id of the {@link User} to fetch
 * @param axios The axios instance
 * @returns Either the loaded user or undefined in case of an error
 * @author Domenico Ferrari
 */
export const loadMultipleUser = async (
  axios: AxiosInstance,
  userIds: string[]
): Promise<User[]> => {
  return axios
    .get("/user/id/many", { params: { userIds: userIds } })
    .then((resp) => resp.data)
    .catch((exc) => {
      console.error("Error during user load!", exc);
      return [];
    });
};

/*
 * API method to create a new user {@link User}
 * @param axios
 * @returns boolean for either successful creation or failed one
 * @author Domenico Ferrari
 */
export const updateUser = async (
  axios: AxiosInstance,
  updatedUser: User
): Promise<boolean> =>
  axios
    .post("user/update/", updatedUser)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error while updating user!");
      console.log(error);
    });
