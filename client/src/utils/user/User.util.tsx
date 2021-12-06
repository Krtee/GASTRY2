import { AxiosInstance } from "axios";
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
  ): Promise<boolean> => {
    return axios
      .post("/user/", newUser)
      .then((response) => response.data)
      .catch(() => {
        console.error("Error while creating a new user!");
      });
  };
