import { useTranslation } from "react-i18next";
import { useParams, useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import PictureEditable from "../PictureEditable/PictureEditable";
import { BuddyInfoProps } from "./BuddyInfo.types";
import {
  addBuddy,
  getFriendRequestStatus,
  removeBuddy,
} from "../../utils/user/User.util";
import { BUDDY_REQUEST } from "../../utils/user/User.types";
import "./BuddyInfo.styles.scss";
import { useAxios } from "../../utils/AxiosUtil";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../../utils/user/User.state";

const BuddyInfo: React.FC<BuddyInfoProps> = ({ buddy }) => {
  const { t } = useTranslation();
  const { axios } = useAxios();
  const [requestSent, setRequestSent] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  let { url } = useRouteMatch();

  const handleAddBuddy = async () => {
    if (buddy) {
      const request = await addBuddy(axios, {
        userId: currentUser.id,
        buddyId: buddy?.id,
      });
      if (request) {
        setRequestSent(true);
      }
    }
  };

  const handleRemoveBuddy = async () => {
    if (buddy) {
      const isRemoved = await removeBuddy(axios, {
        userId: currentUser.id,
        buddyId: buddy?.id,
      });
      if (isRemoved) {
        setRequestSent(false);
      }
    }
  };

  const renderRightButton = () => {
    let status: BUDDY_REQUEST = BUDDY_REQUEST.REJECTED;
    if (buddy) {
      status = getFriendRequestStatus(currentUser, buddy?.id);
    }
    if (status === BUDDY_REQUEST.ACCEPTED) {
      return (
        <button
          className={`user-info-button-secondary`}
          onClick={handleRemoveBuddy}
        >
          {t("general.buttons.added")}
        </button>
      );
    }
    if (status === BUDDY_REQUEST.PENDING || requestSent) {
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
