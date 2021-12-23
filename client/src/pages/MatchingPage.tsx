import { FC, useState } from "react";
import Layout from "../components/layoutComponent/Layout";
import { Page, useNavigation } from "../utils/hooks/useNavigation";
import "../styles/MatchingPage.styles.scss";
import likeimage from '../assets/images/like.svg';
import dislikeimage from '../assets/images/dislike.svg';
import SwipableCard from "../components/swipableCard/SwipableCard";

interface MatchingPageProps {}

var executed = false;

const MatchingPage: FC<MatchingPageProps> = ({}) => {
  const { currentLocation, onLocationChange } = useNavigation(Page.MATCHING);

  const [images, setImages] = useState<any[]>([]);

  const divStyle = {
    marginTop: '30px',
    height: '80%',
    width: '100%',
    color: 'blue',
    borderRadius: '25px'
  };


  function likeImage() {
    console.log("Klappt")
  }

  function dislikeImage() {
    console.log("Klappt")
  }

  // Funktion spinnt noch etwas
  // Die Idee ist, die Funktion lediglich einmal aufzurufen
  var getImages = (function() {
    return function() {
        if (!executed) {
          executed = true;
          fetch('http://yumatch.mi.hdm-stuttgart.de/api/data/meal/some?count=10', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          })
          .then((response) => response.json())
          .then((data) => {
            setImages([...images, data[1].strMealThumb])
          })
          .catch((error) => {
            console.error('Error:', error);
          });
        }
    };
  })();

  getImages();

  return (
    <Layout
      navigationElements={Object.entries(Page).map((page) => ({
        title: page[1],
      }))}
      changeLocation={onLocationChange}
      currentLocation={currentLocation}>
      <SwipableCard>
        <img style={divStyle} src={images[images.length - 1]} />
      </SwipableCard>
      <div className="matching-buttons">
        <span onClick={likeImage} className="dot"><img className="center" src={likeimage} /></span>
        <span onClick={dislikeImage} className="dot"><img className="center" src={dislikeimage} /></span>
      </div>
    </Layout>
  );
};

export default MatchingPage;
