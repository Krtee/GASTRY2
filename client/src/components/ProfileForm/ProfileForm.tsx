import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAxios } from "../../utils/AxiosUtil";
import { updateUserInfo } from "../../utils/user/User.util";
import "./ProfileFormStyles.scss";

interface ProfileFormProps {
  userId: string;
  photo: string;
  name: string;
  address: string;
  favRestaurant: string;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileForm = ({
  userId,
  photo,
  name,
  address,
  favRestaurant,
  setIsEditing,
}: ProfileFormProps) => {
  const axios = useAxios();
  const { t } = useTranslation();
  const [formData, setFormData] = useState<any>({
    userId,
    photo,
    name,
    address,
    favRestaurant,
  });

  return (
    <form
      className="profile-form"
      onSubmit={(evt) => {
        evt.preventDefault();
        updateUserInfo(axios, formData).then((result) => {
          // TODO: if result successful update user state with recoil
          console.log(result);
          setIsEditing(false);
        });
      }}
    >
      <input
        className="profile-form-input"
        placeholder={t("name")}
        value={formData.name}
        onChange={(e) =>
          setFormData((state: any) => ({
            ...state,
            name: e.target.value,
          }))
        }
      />
      <input
        className="profile-form-input"
        placeholder={t("address")}
        value={formData.address}
        onChange={(e) =>
          setFormData((state: any) => ({
            ...state,
            address: e.target.value,
          }))
        }
      />
      <input
        className="profile-form-input"
        placeholder={t("favRestaurant")}
        value={formData.favRestaurant}
        onChange={(e) =>
          setFormData((state: any) => ({
            ...state,
            favRestaurant: e.target.value,
          }))
        }
      />
      <button onClick={() => {}}>{t("save")}</button>
    </form>
  );
};

export default ProfileForm;
