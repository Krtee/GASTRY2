import { ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Checkbox from "../Checkbox/Checkbox";
import { dietsArr, intolerancesArr } from "./UserSettings.types";
import { convertObjToArr } from "../../utils/GeneralUtils";
import "./UserSettings.styles.scss";
import Searchbar from "../Searchbar/Searchbar";
import { useAxios } from "../../utils/AxiosUtil";
import { updateUserInfo } from "../../utils/user/User.util";
import { useRecoilState } from "recoil";
import { userState } from "../../utils/user/User.state";

const UserSettings = () => {
  const axios = useAxios();
  const { t } = useTranslation();
  const [diets, setDiets] = useState<any>({});
  const [intolerances, setIntolerances] = useState<any>({});
  const [city, setCity] = useState<string>("");
  const [liveLocation, setLiveLocation] = useState<boolean>(false);
  const [user, setUser] = useRecoilState(userState);

  // save coords in recoil
  useEffect(() => {
    if (liveLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: any) => {
          setUser((prevState) => ({
            ...prevState,
            lat: position.coords.latitude,
            long: position.coords.longitude,
          }));
        });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    } else {
      setUser((prevState) => ({
        ...prevState,
        lat: "",
        long: "",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveLocation]);

  // Set initial diet & intolerance states
  // useEffect(() => {
  //   const dietsObj: any = {};
  //   const intolerancesObj: any = {};

  //   user.diets?.map((item) => (dietsObj[item] = true));
  //   user.intolerances?.map((item) => (intolerancesObj[item] = true));

  //   setDiets(dietsObj);
  //   setIntolerances(intolerancesObj);
  // }, [user.diets, user.intolerances]);

  // useEffect(() => {
  //   if (Object.keys(diets).length > 0) {
  //     updateUserInfo(axios, {
  //       ...user,
  //       diets: convertObjToArr(diets),
  //     }).then((result) => {
  //       console.log(result);
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [diets]);

  // useEffect(() => {
  //   if (Object.keys(intolerances).length > 0) {
  //     updateUserInfo(axios, {
  //       ...user,
  //       intolerances: convertObjToArr(intolerances),
  //     }).then((result) => {
  //       console.log(result);
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [intolerances]);

  return (
    <div className="user-settings">
      <h3 className="user-settings-subheading">
        {t("general.pages.preferences.diet")}
      </h3>
      {console.log(user)}
      <div className="checkbox-inputs-wrapper">
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
      </div>
      <h3 className="user-settings-subheading">
        {t("general.pages.preferences.intolerances")}
      </h3>
      <div className="checkbox-inputs-wrapper">
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
      <h3 className="user-settings-subheading">
        {t("general.pages.preferences.location")}
      </h3>
      <Searchbar
        value={city}
        placeholder={t("general.pages.preferences.enterCity")}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setCity(e.currentTarget.value)
        }
      />
      <Checkbox
        label={t("general.pages.preferences.useLiveLocation")}
        checked={liveLocation}
        onChange={() => setLiveLocation((prevState: boolean) => !prevState)}
      />
      <h3 className="user-settings-subheading">
        {t("general.pages.preferences.recentLocations")}
      </h3>
    </div>
  );
};

export default UserSettings;
