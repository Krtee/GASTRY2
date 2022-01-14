import { useEffect, useState } from "react";

export interface Geolocation {
  loaded: boolean;
  coordinates?: Coordinates;
  error?: any;
}
export interface Coordinates {
  latitude: string;
  longitude: string;
}
/**
 * hook to get current geolocation of user
 * @returns {@link Geolocation}
 * @author Minh
 */
const useGeoLocation = () => {
  const [location, setLocation] = useState<Geolocation>({
    loaded: false,
    coordinates: { latitude: "", longitude: "" },
  });

  const onSuccess = (location: any) => {
    setLocation({
      loaded: true,
      coordinates: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
  };

  const onError = (error: any) => {
    setLocation({
      loaded: true,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  };

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      onError({
        code: 0,
        message: "Geolocation not supported",
      });
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return location;
};

export default useGeoLocation;
