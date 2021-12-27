import { useState } from "react";
import { useTranslation } from "react-i18next";
import { convertObjToArr } from "../../utils/GeneralUtils";
import Checkbox from "../Checkbox/Checkbox";
import { dietsArr, intolerancesArr } from "./UserSettings.types";

const UserSettings = () => {
  const { t } = useTranslation();
  const [diets, setDiets] = useState<any>({});
  const [intolerances, setIntolerances] = useState<any>({});

  return (
    <div className="user-settings">
      <h3>{t("general.pages.preferences.diet")}</h3>
      {dietsArr.map((diet) => (
        <Checkbox
          key={diet}
          label={diet}
          checked={diets[diet] === undefined ? false : diets[diet]}
          onChange={() =>
            setDiets((prevState: any) => ({
              ...prevState,
              [diet]: !prevState[diet],
            }))
          }
        />
      ))}
      <h3>{t("general.pages.preferences.intolerances")}</h3>
      {intolerancesArr.map((intolerance) => (
        <Checkbox
          key={intolerance}
          label={intolerance}
          checked={
            intolerances[intolerance] === undefined
              ? false
              : intolerances[intolerance]
          }
          onChange={() =>
            setIntolerances((prevState: any) => ({
              ...prevState,
              [intolerance]: !prevState[intolerance],
            }))
          }
        />
      ))}
    </div>
  );
};

export default UserSettings;
