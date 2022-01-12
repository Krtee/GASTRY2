import { FC, useState } from "react";
import arrow from "../assets/images/arrow.svg";
import dislikesvg from "../assets/images/dislike.svg";
import groupaddsvg from "../assets/images/groupadd.svg";
import likesvg from "../assets/images/like.svg";
import resetsvg from "../assets/images/reset.svg";
import settingsvg from "../assets/images/settings.svg";
import Layout from "../components/LayoutComponent/Layout";
import SwipableCard from "../components/SwipableCard/SwipableCard";
import "../styles/MatchingPage.styles.scss";
import { Page, useNavigation } from "../utils/hooks/useNavigation";

interface MatchingPageProps {}

var executed = false;

const MatchingPage: FC<MatchingPageProps> = ({}) => {
  const { currentLocation, onLocationChange } = useNavigation(Page.MATCHING);

  const [images, setImages] = useState<any[]>([
    "https://images.pexels.com/photos/2198626/pexels-photo-2198626.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
  ]);

  const [progress, setProgress] = useState<number>(10);

  const divStyle = {
    height: "80%",
    width: "100%",
    color: "blue",
    borderRadius: "25px",
  };

  function likeImage() {
    if (progress < 100) {
      setProgress(progress + 10);
    }
  }

  function dislikeImage() {
    if (progress > 10) {
      setProgress(progress - 10);
    }
  }

  function resetImage() {
    console.log("Klappt");
  }

  // Funktion spinnt noch etwas
  // Die Idee ist, die Funktion lediglich einmal aufzurufen
  var getImages = (function () {
    return function () {
      if (!executed) {
        executed = true;
        fetch("", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setImages([...images, data[1].strMealThumb]);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    };
  })();

  //getImages();

  return (
    <Layout
      navigationElements={Object.entries(Page).map((page) => ({
        title: page[1],
      }))}
      changeLocation={onLocationChange}
      currentLocation={currentLocation}
    >
      <SwipableCard>
        <div className="container">
          <span onClick={resetImage} className="back-button">
            <img className="top-left" src={arrow} />
          </span>
          <img style={divStyle} src={images[images.length - 1]} />
          <div className="progressBar">
            <div className="progressBarStyle" style={{ width: progress + "%" }}>
              <span className="progressBarText">{progress + "%"}</span>
            </div>
          </div>
        </div>
      </SwipableCard>
      <div className="matching-buttons">
        <span className="button-small">
          <img className="button-small-style" src={settingsvg} />
        </span>
        <span onClick={dislikeImage} className="button-big">
          <img className="button-center" src={dislikesvg} />
        </span>
        <span onClick={resetImage} className="button-small">
          <img className="button-small-style" src={resetsvg} />
        </span>
        <span onClick={likeImage} className="button-big">
          <img className="button-center" src={likesvg} />
        </span>
        <span className="button-small">
          <img className="button-small-style" src={groupaddsvg} />
        </span>
      </div>
    </Layout>
  );
};

export default MatchingPage;
