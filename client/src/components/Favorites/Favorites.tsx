import { useTranslation } from "react-i18next";
import "./Favorites.stylings.scss";
import { favsDummyData } from "./Favorites.types";

const Favorites: React.FC<{}> = () => {
  const { t } = useTranslation();

  const removeFavorite = (id: string) => {
    // TODO: remove fav from database
    console.log(id);
  };

  return (
    <div className="favorites">
      {favsDummyData?.map((item) => (
        <div key={item._id} className="favorites-item">
          <p>{item.name}</p>
          <button onClick={() => removeFavorite(item._id)}>
            {t("general.buttons.added")}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Favorites;
