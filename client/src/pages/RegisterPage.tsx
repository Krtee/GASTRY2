import { FC } from "react";
import Layout from "../components/layoutComponent/Layout";
import Textfield from "../components/InputComponent/InputComponent";
import Button from "../components/button/Button";
import { useTranslation } from "react-i18next";
import "../styles/RegisterPage.styles.scss";

interface RegisterPageProps {}

const RegisterPage: FC<RegisterPageProps> = () => {
  const { t } = useTranslation();

  return (
    <Layout 
    hideBar
    hideHeader
    >
      <div className="wrapper">
        <h2 className="header">yumatch</h2>
        <form className="form">
        <Textfield
            placeholder={t("general.pages.register.username")}
            onChange={() => {}}
            type="text"
          />
          <Textfield
            placeholder={t("general.pages.register.email")}
            onChange={() => {}}
            type="text"
          />
          <Textfield
            placeholder={t("general.pages.register.password")}
            onChange={() => {}}
            type="password"
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
