import PictureEditable from "../PictureEditable/PictureEditable";
import { UserInfoComponentProps } from "./UserInfo.types";
import "./UserInfoStyles.scss";

const UserInfo = ({
  firstName,
  lastName,
  username,
}: UserInfoComponentProps) => {
  const onUpload = () => {};

  return (
    <div className="user-info">
      <PictureEditable photo={""} onUpload={onUpload} />
      <div className="user-info-wrapper">
        <h3 className="user-info-name">
          {firstName} {lastName}
        </h3>
        <p className="">@{username}</p>
      </div>
    </div>
  );
};

export default UserInfo;
