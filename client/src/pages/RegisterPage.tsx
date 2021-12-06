import { FC, useState } from "react";
import Layout from "../components/LayoutComponent/Layout";
import InputComponent from "../components/InputComponent/InputComponent";
import Button from "../components/button/Button";
import { useTranslation } from "react-i18next";
import "../styles/RegisterPage.styles.scss";
import { createEmptyUser, createNewUser } from "../utils/user/User.util";
import { User } from "../utils/user/User.types";
import { useSetRecoilState } from "recoil";
import { userState } from "../utils/user/User.state";
import { ResponseTypes, useAxios } from "../utils/AxiosUtil";

interface RegisterPageProps {}

const RegisterPage: FC<RegisterPageProps> = () => {
  const { t } = useTranslation();
  const [registerUser, setRegisterUser] = useState<User>(createEmptyUser());
  const [confirmPassword, setConfirmPassword] = useState({
    error: "",
    value: "",
  });
  const axios = useAxios();
  const setUser = useSetRecoilState(userState);

  return (
    <Layout hideBar hideHeader>
      <div className="wrapper">
        <h2 className="header">yumatch</h2>
        <form
          className="form"
          onSubmit={(evt) => {
            evt.preventDefault();
            createNewUser(axios, registerUser).then((result) => {
              switch (result) {
                case ResponseTypes.SUCCESSFUL:
                  setUser(registerUser);
                  console.log("Successfully created new user");
                  return;
                case ResponseTypes.REGISTER_ERROR:
                  console.log("Error while registering");
                  return;
                case ResponseTypes.REGISTER_USER_EXISTS:
                  console.log("User already exists");
                  return;
              }
            });
          }}
        >
          <InputComponent
            placeholder={t("general.pages.register.username")}
            value={registerUser.username}
            onChange={(value) =>
              setRegisterUser((user) => ({
                ...user,
                username: value,
              }))
            }
            type="text"
            required
          />
          <InputComponent
            placeholder={t("general.pages.register.email")}
            value={registerUser.email}
            onChange={(value) =>
              setRegisterUser((user) => ({
                ...user,
                email: value,
              }))
            }
            type="text"
            required
          />
          <InputComponent
            placeholder={t("general.pages.register.password")}
            value={registerUser.password || ""}
            onChange={(value) =>
              setRegisterUser((user) => ({
                ...user,
                password: value,
              }))
            }
            type="password"
            required
          />
          <InputComponent
            placeholder={t("general.pages.register.passwordAgain")}
            value={confirmPassword.value}
            onChange={(value) =>
              setConfirmPassword((passwordState) => ({
                ...passwordState,
                value: value,
              }))
            }
            onBlur={(value) =>
              setConfirmPassword((passwordState) => ({
                ...passwordState,
                error: value,
              }))
            }
            error={confirmPassword.error}
            type="password"
            required
          />
          <Button
            label={t("general.pages.register.buttonLabel")}
            onClick={() => {}}
          />
        </form>
      </div>
    </Layout>
  );
};

export default RegisterPage;
