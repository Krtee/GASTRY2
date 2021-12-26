import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAxios } from "../../utils/AxiosUtil";
import { User } from "../../utils/user/User.types";
import { updateUserInfo } from "../../utils/user/User.util";
import "./ProfileFormStyles.scss";

interface ProfileFormProps {
  userData: User;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const inputs: string[] = [
  "firstName",
  "lastName",
  "city",
  "favoriteRestaurants",
];

const ProfileForm = ({ userData, setIsEditing }: ProfileFormProps) => {
  const axios = useAxios();
  const { t } = useTranslation();
  const [formData, setFormData] = useState<User>(userData);

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
      {inputs.map((input: string) => (
        <input
          className="profile-form-input"
          placeholder={t(`${input}`)}
          value={formData[input as keyof typeof formData]}
          onChange={(e) =>
            setFormData((state: any) => ({
              ...state,
              [input]: e.target.value,
            }))
          }
        />
      ))}
      <button onClick={() => {}}>{t("save")}</button>
    </form>
  );
};

export default ProfileForm;
