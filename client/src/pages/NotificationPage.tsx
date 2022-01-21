import React from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import Layout from "../components/LayoutComponent/Layout";
import NotificationCardComponent, {
  NotificationCardComponentProps,
} from "../components/NotificationCardComponent/NotificationCardComponent";
import { Page, useNavigation } from "../utils/hooks/useNavigation";
import { ReactComponent as ArrowLeftIcon } from "../assets/icons/arrow_left.svg";
import {
  NotificationPageProps,
  NotificationType,
} from "../utils/notification/Notification.types";
import { userState } from "../utils/user/User.state";
import "../styles/NotificationPage.styles.scss";
import { useHistory } from "react-router";

const NotificationPage: React.FC<NotificationPageProps> = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { currentLocation, onLocationChange, navItems } = useNavigation(
    Page.NOTIFICATION
  );
  const user = useRecoilValue(userState);
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
    },
    {
      title: "TestNoti",
      message: "This is a test noti",
      notificationType: NotificationType.MULTI_MATCH,
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
      navigationElements={navItems}
      changeLocation={onLocationChange}
      currentLocation={currentLocation}
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
