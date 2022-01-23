import React from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import Layout from "../components/LayoutComponent/Layout";
import { Page, useNavigation } from "../utils/hooks/useNavigation";
import { NotificationPageProps } from "../utils/notification/Notification.types";
import { userState } from "../utils/user/User.state";

const NotificationPage: React.FC<NotificationPageProps> = () => {
  const { t } = useTranslation();
  const navProps = useNavigation(Page.NOTIFICATION);
  const user = useRecoilValue(userState);
  return (
    <Layout {...navProps} hideBar>
      <div className="notification-page--wrapper"></div>
    </Layout>
  );
};

export default NotificationPage;
