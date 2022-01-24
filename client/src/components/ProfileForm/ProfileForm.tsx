import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { useAxios } from "../../utils/AxiosUtil";
import { Page, useNavigation } from "../../utils/hooks/useNavigation";
import { User } from "../../utils/user/User.types";
import { ReactComponent as ArrowIcon } from "../../assets/icons/arrow_left.svg";
import Layout from "../LayoutComponent/Layout";
import PictureEditable from "../PictureEditable/PictureEditable";
import "./ProfileFormStyles.scss";
import { updateUser } from "../../utils/user/User.util";
import { useRecoilState } from "recoil";
import { userState } from "../../utils/user/User.state";

const inputs: string[] = ["firstName", "lastName", "username", "bio"];

const ProfileForm: React.FC<{}> = () => {
  const { axios } = useAxios();
  const { t } = useTranslation();
  const { currentLocation, onLocationChange } = useNavigation();
  const [user, setUser] = useRecoilState(userState);
  const [formData, setFormData] = useState<any>(user);
  const history = useHistory();

  const onUpload = () => {};

  const onSubmit = async () => {
    await updateUser(axios, formData);
  };

  return (
    <Layout
      navigationElements={Object.entries(Page).map((page) => ({
        title: page[1],
      }))}
      changeLocation={onLocationChange}
      currentLocation={currentLocation}
      header={{
        leftIconButton: {
          value: <ArrowIcon />,
          onClick: () => {
            history.goBack();
          },
        },
        title: t("general.pages.profile.editProfile"),
      }}
    >
      <div className="profile-form">
        <div className="profile-form-wrapper">
          <PictureEditable
            styles={{ background: "black" }}
            photo={""}
            onUpload={onUpload}
          />
          <button
            className="profile-form-btn profile-form-edit-pic"
            onClick={onUpload}
          >
            <span className="user-info-edit-btn-icon user-info-interactions-element-icon"></span>
            {t("general.pages.profile.editPic")}
          </button>
          {inputs.map((item: string) => (
            <div key={item} className="profile-form-input">
              <label>{t(`general.pages.profile.${item}`)}:</label>
              <input
                type="text"
                value={formData[item] ? formData[item] : ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData((state: any) => ({
                    ...state,
                    [item]: e.target.value,
                  }))
                }
              />
            </div>
          ))}
        </div>
        <button
          className="profile-form-btn profile-form-submit"
          onClick={onSubmit}
        >
          {t("general.pages.profile.saveChanges")}
        </button>
      </div>
    </Layout>
  );
};

export default ProfileForm;
