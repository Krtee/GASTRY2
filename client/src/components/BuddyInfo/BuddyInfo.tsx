import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useAxios } from "../../utils/AxiosUtil";
import { userState } from "../../utils/user/User.state";
import { BuddyType } from "../../utils/user/User.types";
import {
  addBuddy,
  getFriendRequestStatus,
  removeBuddy,
} from "../../utils/user/User.util";
import PictureEditable from "../PictureEditable/PictureEditable";
import "./BuddyInfo.styles.scss";
import { BuddyInfoProps } from "./BuddyInfo.types";

const BuddyInfo: React.FC<BuddyInfoProps> = ({ buddy }) => {
  const { t } = useTranslation();
  const { axios } = useAxios();
  const [requestSent, setRequestSent] = useState<boolean>(false);
  const { user } = useRecoilValue(userState);
  let { url } = useRouteMatch();

  /**
   * adds a buddy to buddylist
   */
  const handleAddBuddy = async () => {
    if (buddy && user) {
      const request = await addBuddy(axios, {
        userId: user.id,
        buddyId: buddy?.id,
      });
      if (request) {
        setRequestSent(true);
      }
    }
  };

  /**
   * removes a buddy from buddylist
   */
  const handleRemoveBuddy = async () => {
    if (buddy && user) {
      const isRemoved = await removeBuddy(axios, {
        userId: user.id,
        buddyId: buddy?.id,
      });
      if (isRemoved) {
        setRequestSent(false);
      }
    }
  };

  const renderRightButton = () => {
    let status: BuddyType = BuddyType.REJECTED;
    if (buddy && user) {
      status = getFriendRequestStatus(user, buddy?.id) || BuddyType.REJECTED;
    }
    if (status === BuddyType.ACCEPTED) {
      return (
        <button
          className={`user-info-button-secondary`}
          onClick={handleRemoveBuddy}
        >
          {t("general.buttons.added")}
        </button>
      );
    }
    if (status === BuddyType.PENDING || requestSent) {
      return (
        <button
          className={`user-info-button-secondary`}
          onClick={handleRemoveBuddy}
        >
          {t("general.buttons.pending")}
        </button>
      );
    }

    return (
      <button className="user-info-button-primary" onClick={handleAddBuddy}>
        {t("general.buttons.add")}
      </button>
    );
  };

  return (
    <div className="user-info">
      <div className="user-info-header">
        {/* TODO: add link to matching */}
        <Link
          className="user-info-button-primary user-info-search-btn"
          to={`${url}`}
        >
          <span className="user-info-match-btn-icon user-info-button-icon"></span>
          {t("general.pages.profile.match")}
        </Link>
        <PictureEditable
          styles={{ background: "black" }}
          photo={""}
          onUpload={() => {}}
        />
        {renderRightButton()}
      </div>
      <div className="user-info-wrapper">
        <p className="user-info-username">@{buddy?.username}</p>
        <p>{buddy?.bio}</p>
      </div>
    </div>
  );
};

export default BuddyInfo;
