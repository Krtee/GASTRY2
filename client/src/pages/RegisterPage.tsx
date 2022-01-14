import { useKeycloak } from "@react-keycloak/web";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import ButtonComponent from "../components/ButtonComponent/ButtonComponent";
import InputComponent from "../components/InputComponent/InputComponent";
import Layout from "../components/LayoutComponent/Layout";
import "../styles/RegisterPage.styles.scss";
import { ResponseTypes, useAxios } from "../utils/AxiosUtil";
import { User } from "../utils/user/User.types";
import { createEmptyUser, createNewUser } from "../utils/user/User.util";

interface RegisterPageProps {}

const RegisterPage: FC<RegisterPageProps> = () => {
  const { t } = useTranslation();
  const [registerUser, setRegisterUser] = useState<User>(createEmptyUser());
  const { keycloak, initialized } = useKeycloak();

  const [confirmPassword, setConfirmPassword] = useState({
    error: false,
    value: "",
  });
  const { axios } = useAxios();
  const [registerError, setRegisterError] = useState<ResponseTypes>();
  const history = useHistory();

  /**
   * Helper method to redirect to matching when user already is logged in
   * @author Domenico Ferrari
   */
  useEffect(() => {
    if (initialized && keycloak.authenticated) history.replace("/matching");
    // eslint-disable-next-line
  }, [keycloak, axios]);

  return (
    <Layout hideBar hideHeader>
      <div className="register-page-wrapper">
        <div className="header-wrapper">
          <h2 className="header">yumatch</h2>
          {registerError && (
            <p className="register-error-header">
              {t(`general.pages.register.${registerError}`)}
            </p>
          )}
        </div>

        <form
          className="form"
          onInvalid={(evt) => {
            evt.preventDefault();
          }}
          onSubmit={(evt) => {
            evt.preventDefault();
            if (confirmPassword.error) return;
            createNewUser(axios, registerUser).then((result) => {
              if (result === ResponseTypes.SUCCESSFUL) {
                setRegisterError(undefined);
                keycloak.login({ loginHint: registerUser.username });
              } else {
                setRegisterError(result);
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
            type="email"
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
            id="passwordAgainField"
            placeholder={t("general.pages.register.passwordAgain")}
            value={confirmPassword.value}
            onChange={(value) =>
              setConfirmPassword((passwordState) => ({
                ...passwordState,
                value: value,
              }))
            }
            onBlur={(value) => {
              if (value !== registerUser.password) {
                setConfirmPassword((passwordState) => ({
                  ...passwordState,
                  error: true,
                }));
              } else {
                setConfirmPassword((passwordState) => ({
                  ...passwordState,
                  error: false,
                }));
              }
            }}
            errorLabel={
              confirmPassword.error ? "Passwörter stimmen nicht überein" : ""
            }
            type="password"
            required
          />
          <ButtonComponent
            onClick={() => {}}
            type="submit"
            value={t("general.pages.register.buttonLabel")}
          />
        </form>
      </div>
    </Layout>
  );
};

export default RegisterPage;
