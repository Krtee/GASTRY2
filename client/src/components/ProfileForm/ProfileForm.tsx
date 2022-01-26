import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { useRecoilState } from "recoil";
import { ReactComponent as ArrowIcon } from "../../assets/icons/arrow_left.svg";
import { useAxios } from "../../utils/AxiosUtil";
import { Page, useNavigation } from "../../utils/hooks/useNavigation";
import { userState } from "../../utils/user/User.state";
import { updateUser } from "../../utils/user/User.util";
import Layout from "../LayoutComponent/Layout";
import PictureEditable from "../PictureEditable/PictureEditable";
import "./ProfileFormStyles.scss";

const inputs: string[] = ["firstName", "lastName", "username", "bio"];

const ProfileForm: React.FC<{}> = () => {
  const { axios } = useAxios();
  const { t } = useTranslation();
  const navProps = useNavigation(Page.PROFILE_FORM);
  const [{ user }, setUser] = useRecoilState(userState);
  const [formData, setFormData] = useState<any>(user);
  const history = useHistory();

  const onUpload = () => {};

  const onSubmit = async () => {
    const data = await updateUser(axios, formData);
    if (data) {
      setUser((prevState) => ({
        ...prevState,
        user: {
          ...formData,
        },
      }));
    }
  };

  return (
    <Layout
      {...navProps}
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
