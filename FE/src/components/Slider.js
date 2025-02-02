import React from "react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from './Card';
import './style/Slider.css';

function Slider(props){
  const [currentSlide, setCurrentSlide] = useState(0);
  const TOTAL_SLIDES = Math.ceil(2);
  const slideRef = useRef(null);

  function generateImagePaths(folderPath, count) {
    return Array.from({ length: count }, (_, index) => `${folderPath}/Banner_${index + 1}.png`);
  }
  
  const images = generateImagePaths('/img/banner', 2); // 5개의 이미지 경로 생성
  
  const nextSlide = () => {
    if (currentSlide >= TOTAL_SLIDES-1) { // 더 이상 넘어갈 슬라이드가 없으면 슬라이드를 초기화합니다.
      setCurrentSlide(0);
    } else {
      setCurrentSlide(currentSlide + 1);
      console.log(currentSlide);
    }
  };

  const prevSlide = () => {
    if (currentSlide === 0) {
      setCurrentSlide(TOTAL_SLIDES-1);
    } else {
      setCurrentSlide(currentSlide - 1);
      console.log(currentSlide);
    }
  };

  useEffect(() => {
    slideRef.current.style.transition = "all 0.5s ease-in-out";
    slideRef.current.style.transform = `translateX(-${currentSlide*100}%)`;
  }, [currentSlide]);

  
  return (
      <div className="Container">
        <img 
          src='./img/Carousel_left.svg' 
          onClick={()=>prevSlide()}
          className="SliderButton-left"
        />
        <div className="SliderContainer" ref={slideRef}>
          {
              images.map(
                function(a, i){
                return (
                    <img src={a}/>
                )
              })
          }
        </div>
        <img 
          src='./img/Carousel_right.svg' 
          onClick={()=>nextSlide()}
          className="SliderButton-right"
        />
      </div>
    );
}

export default Slider;
