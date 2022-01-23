import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { useRecoilValue } from "recoil";
import { ReactComponent as ArrowLeftIcon } from "../assets/icons/arrow_left.svg";
import Layout from "../components/LayoutComponent/Layout";
import {
  NotificationCardComponent,
  NotificationCardComponentProps,
} from "../components/NotificationCardComponent/NotificationCardComponent";
import "../styles/NotificationPage.styles.scss";
import { Page, useNavigation } from "../utils/hooks/useNavigation";
import {
  NotificationPageProps,
  NotificationType,
} from "../utils/notification/Notification.types";
import { userState } from "../utils/user/User.state";

const NotificationPage: React.FC<NotificationPageProps> = () => {
  const { t } = useTranslation();
  const navProps = useNavigation(Page.NOTIFICATION);
  const user = useRecoilValue(userState);
  const history = useHistory();
  const demoNoti: NotificationCardComponentProps[] = [
    {
      title: "TestNoti",
      message: "This is a test noti",
      notificationType: NotificationType.BUDDY_REQUEST,
    },
    {
      title: "TestNoti",
      message: "This is a test noti",
      notificationType: NotificationType.BUDDY_REQUEST,
    },
    {
      title: "TestNoti",
      message: "This is a test noti",
      notificationType: NotificationType.BUDDY_REQUEST,
      disableAnimation: true,
    },
    {
      title: "TestNoti",
      message: "This is a test noti",
      notificationType: NotificationType.MULTI_MATCH,
      disableAnimation: true,
    },
    {
      title: "TestNoti",
      message: "This is a test noti",
      notificationType: NotificationType.MULTI_MATCH,
      seen: true,
    },
  ];
  return (
    <Layout
      {...navProps}
      header={{
        leftIconButton: {
          value: <ArrowLeftIcon />,
          onClick: () => history.goBack(),
        },
        title: t("general.navigation.NOTIFICATION"),
      }}
    >
      <div className="notification-page--wrapper">
        {demoNoti.map((noti, index) => (
          <NotificationCardComponent {...noti} index={index} />
        ))}
      </div>
    </Layout>
  );
};

export default NotificationPage;
