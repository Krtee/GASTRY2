import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import Layout from "../components/LayoutComponent/Layout";
import {
  generateNotification,
  NotificationCardComponent,
  NotificationCardComponentProps,
} from "../components/NotificationCardComponent/NotificationCardComponent";
import { Page, useNavigation } from "../utils/hooks/useNavigation";
import { ReactComponent as ArrowLeftIcon } from "../assets/icons/arrow_left.svg";
import {
  Notification,
  NotificationPageProps,
  NotificationType,
} from "../utils/notification/Notification.types";
import { userState } from "../utils/user/User.state";
import "../styles/NotificationPage.styles.scss";
import { useHistory } from "react-router";
import { useAxios } from "../utils/AxiosUtil";
import {
  loadAllNotifications,
  persistentNotificationHaveBeenSeen,
} from "../utils/notification/Notification.util";

const NotificationPage: React.FC<NotificationPageProps> = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { currentLocation, onLocationChange, navItems } = useNavigation(
    Page.NOTIFICATION
  );
  const { axios } = useAxios();
  const user = useRecoilValue(userState);

  const [peristentNotifcationList, setPeristentNotifcationList] =
    useState<Notification[]>();

  useEffect(() => {
    if (!axios || !user || !user.id) return;
    loadAllNotifications(user!.id, axios).then((notifications) => {
      setPeristentNotifcationList(notifications);
    });

    return () => {
      persistentNotificationHaveBeenSeen(user!.id, axios);
    };
  }, [axios, user]);
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
        {peristentNotifcationList?.map((noti, index) => (
          <NotificationCardComponent
            {...noti}
            index={index}
            key={index}
            onClick={
              noti.notificationType === NotificationType.MULTI_MATCH
                ? () => history.push(`/matching/result/${noti.matchId}`)
                : noti.notificationType === NotificationType.BUDDY_REQUEST
                ? () => alert("IMPLEMET ROUTING TO FRIENDS PAGE")
                : () => alert("NO DEFAULT IMPLEMENT")
            }
          />
        ))}
      </div>
    </Layout>
  );
};

export default NotificationPage;
