import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { useAxios } from "../../utils/AxiosUtil";
import { convertObjToArr } from "../../utils/GeneralUtils";
import { userState } from "../../utils/user/User.state";
import { CUISINES, DIETS, TYPES } from "../../utils/user/User.types";
import { updateUser } from "../../utils/user/User.util";
import Switch from "../Switch/Switch";
import "./UserSettings.styles.scss";

const UserSettings: React.FC<{}> = () => {
  const { axios } = useAxios();
  const { t } = useTranslation();

  /* 
  - preferences are saved as object like { vegan: true, meat: false } 
  - no easy way to create a type here bc the object is empty
  at first then it gets populated when user change preferences
  - they are then converted to array of enums when sent to backend
  */
  const [diets, setDiets] = useState<any>({});
  const [types, setTypes] = useState<any>({});
  const [cuisines, setCuisines] = useState<any>({});
  const [{ user }, setUser] = useRecoilState(userState);

  const onSubmit = async () => {
    if (!user) return;

    try {
      const data = await updateUser(axios, {
        ...user,
        diets: convertObjToArr(diets),
        types: convertObjToArr(types),
        cuisines: convertObjToArr(cuisines),
      });
      if (data) {
        setUser((prevState) => ({
          ...prevState,
          user: {
            ...user,
            diets: convertObjToArr(diets),
            types: convertObjToArr(types),
            cuisines: convertObjToArr(cuisines),
          },
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Set initial diet & intolerance states
  useEffect(() => {
    if (!user) return;

    const dietsObj: any = {};
    const typesObj: any = {};
    const cuisinesObj: any = {};

    user.diets?.map((item) => (dietsObj[item] = true));
    user.cuisines?.map((item) => (cuisinesObj[item] = true));
    user.types?.map((item) => (typesObj[item] = true));

    setDiets(dietsObj);
    setCuisines(cuisinesObj);
    setTypes(typesObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.cuisines, user?.diets, user?.intolerances, user?.types]);

  return (
    <div className="user-settings">
      <div className="switch-inputs-wrapper">
        <p>{t("general.pages.preferences.filterPresets")}</p>
        <button className="user-settings-save-btn" onClick={onSubmit}>
          {t("general.buttons.save")}
        </button>
      </div>
      <h3 className="user-settings-subheading">
        {t("general.pages.preferences.type")}
      </h3>
      <div className="switch-inputs-wrapper">
        {Object.values(TYPES).map((item) => (
          <Switch
            key={item}
            label={t(`general.pages.preferences.${item.toLowerCase()}`)}
            checked={types[item] === undefined ? false : types[item]}
            onChange={() =>
              setTypes((prevState: any) => ({
                ...prevState,
                [item]: !prevState[item],
              }))
            }
          />
        ))}
      </div>

      <h3 className="user-settings-subheading">
        {t("general.pages.preferences.diet")}
      </h3>
      <div className="switch-inputs-wrapper">
        {Object.values(DIETS).map((item) => (
          <Switch
            key={item}
            label={t(`general.pages.preferences.${item.toLowerCase()}`)}
            checked={diets[item] === undefined ? false : diets[item]}
            onChange={() =>
              setDiets((prevState: any) => ({
                ...prevState,
                [item]: !prevState[item],
              }))
            }
          />
        ))}
      </div>

      <h3 className="user-settings-subheading">
        {t("general.pages.preferences.selectCuisine")}
      </h3>
      <div className="switch-inputs-wrapper-1-col">
        {Object.values(CUISINES).map((cuisine) => (
          <Switch
            key={cuisine}
            label={t(`general.pages.preferences.${cuisine.toLowerCase()}`)}
            checked={
              cuisines[cuisine] === undefined ? false : cuisines[cuisine]
            }
            onChange={() =>
              setCuisines((prevState: any) => ({
                ...prevState,
                [cuisine]: !prevState[cuisine],
              }))
            }
          />
        ))}
      </div>
    </div>
  );
};

export default UserSettings;
