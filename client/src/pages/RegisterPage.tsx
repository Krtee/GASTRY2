import { FC, useState } from "react";
import Layout from "../components/LayoutComponent/Layout";
import InputComponent from "../components/InputComponent/InputComponent";
import Button from "../components/button/Button";
import { useTranslation } from "react-i18next";
import "../styles/RegisterPage.styles.scss";
import { createEmptyUser } from "../utils/user/User.util";
import { User } from "../utils/user/User.types";

interface RegisterPageProps {}

const RegisterPage: FC<RegisterPageProps> = () => {
  const { t } = useTranslation();
  const [registerUser, setRegisterUser] = useState<User>(createEmptyUser());
  const [confirmPassword, setConfirmPassword] = useState("");



  return (
    <Layout 
    hideBar
    hideHeader
    >
      <div className="wrapper">
        <h2 className="header">yumatch</h2>
        <form className="form">
        <InputComponent
            placeholder={t("general.pages.register.username")}
            value={registerUser.username}
            onChange={(value) => setRegisterUser(user => ({
              ...user,
              username: value
            }))}
            type="text"
            required
          />
          <InputComponent
            placeholder={t("general.pages.register.email")}
            value={registerUser.email}
            onChange={(value) => setRegisterUser(user => ({
              ...user,
              email: value
            }))}
            type="text"
            required
          />
          <InputComponent
            placeholder={t("general.pages.register.password")}
            value={registerUser.password || ""}
            onChange={(value) => setRegisterUser(user => ({
              ...user,
              password: value
            }))}
            type="password"
            required
          />
          <InputComponent
            placeholder={t("general.pages.register.passwordAgain")}
            value={confirmPassword}
            onChange={(value) => setConfirmPassword(value)}
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
