import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAxios } from "../../utils/AxiosUtil";
import { Page, useNavigation } from "../../utils/hooks/useNavigation";
import { User } from "../../utils/user/User.types";
// import { updateUserInfo } from "../../utils/user/User.util";
import Layout from "../LayoutComponent/Layout";
import PictureEditable from "../PictureEditable/PictureEditable";
import "./ProfileFormStyles.scss";

const inputs: string[] = ["firstName", "lastName", "username", "bio"];

const ProfileForm: React.FC<{}> = () => {
  const axios = useAxios();
  const { t } = useTranslation();
  const { currentLocation, onLocationChange } = useNavigation();
  const [formData, setFormData] = useState<any>({});

  const onUpload = () => {};

  const onSubmit = () => {};

  return (
    <Layout
      navigationElements={Object.entries(Page).map((page) => ({
        title: page[1],
      }))}
      changeLocation={onLocationChange}
      currentLocation={currentLocation}
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
          {inputs.map((item) => (
            <div key={item} className="profile-form-input">
              <label>{t(`general.pages.profile.${item}`)}:</label>
              <input type="text" />
            </div>
          ))}
        </div>
        <button
          className="profile-form-btn profile-form-submit"
          onClick={onUpload}
        >
          {t("general.pages.profile.saveChanges")}
        </button>
      </div>
    </Layout>
  );
};

export default ProfileForm;
