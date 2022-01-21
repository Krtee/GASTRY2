import { divIcon, LatLngExpression } from "leaflet";
import ReactDOMServer from "react-dom/server";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { openInNewTab } from "../../utils/GeneralUtils";
import { GoogleMapsResponseRestaurant } from "../../utils/match/Match.types";
import CardComponent from "../CardComponent/CardComponent";
import IconButtonComponent from "../IconButtonComponent/IconButtonComponent";
import { ReactComponent as PhoneIcon } from "./../../assets/icons/call.svg";
import { ReactComponent as PlaceIcon } from "./../../assets/icons/place.svg";
import { ReactComponent as WebsiteIcon } from "./../../assets/icons/web.svg";
import "./RestaurantInfoComponentStyles.scss";

interface RestaurantInfoComponentProps {
  restaurantToShow: GoogleMapsResponseRestaurant;
}

const RestaurantInfoComponent: React.FC<RestaurantInfoComponentProps> = ({
  restaurantToShow,
}) => {
  const location: LatLngExpression = [
    parseInt(restaurantToShow.geometry?.location?.lat || "0"),
    parseInt(restaurantToShow.geometry?.location?.lng || "0"),
  ];
  const customMarkerIcon = divIcon({
    html: ReactDOMServer.renderToString(<PlaceIcon fill="#f2594b" />),
  });

  return (
    <CardComponent className="result-card restaurant-info__wrapper">
      <div className="restaurant-info__item">
        <IconButtonComponent
          value={<PlaceIcon />}
          size="small"
          color="primary"
        />
        <p>{restaurantToShow.vicinity}</p>
      </div>
      <div
        onClick={() =>
          openInNewTab(`http://maps.google.com/?q=${restaurantToShow.vicinity}`)
        }
      >
        <MapContainer
          className="restaurant-info__map-wrapper"
          center={location}
          zoom={13}
          scrollWheelZoom={false}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={location} icon={customMarkerIcon} />
        </MapContainer>
      </div>

      <div className="restaurant-info__item">
        <IconButtonComponent
          value={<PhoneIcon />}
          size="small"
          color="primary"
        />
        <a href={`tel:${restaurantToShow.international_phone_number}`}>
          {restaurantToShow.formatted_phone_number}
        </a>
      </div>
      <div className="restaurant-info__item">
        <IconButtonComponent
          value={<WebsiteIcon />}
          size="small"
          color="primary"
        />
        <p
          onClick={() =>
            restaurantToShow.website
              ? openInNewTab(restaurantToShow.website)
              : () => {}
          }
        >
          {restaurantToShow.website}
        </p>
      </div>

      <div className="restaurant-info__item">
        <IconButtonComponent
          value={<PhoneIcon />}
          size="small"
          color="primary"
        />
        <p>
          {restaurantToShow?.opening_hours?.weekday_text![
            new Date().getDay()
          ].split("day: ")[1] || ""}
        </p>
      </div>
    </CardComponent>
  );
};

export default RestaurantInfoComponent;
