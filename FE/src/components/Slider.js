import React from "react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from './Card';
import './style/Slider.css';

function Slider(props){
  const [currentSlide, setCurrentSlide] = useState(0);
  const TOTAL_SLIDES = Math.ceil(props.data.length / 3);
  const slideRef = useRef(null);

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
      setCurrentSlide(TOTAL_SLIDES);
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
        <div className="SliderButton left">
        <img 
          src='./img/Carousel_left.svg' 
          onClick={()=>prevSlide()}
        />
        </div>
        <div className="SliderContainer" ref={slideRef}>
          {
              props.data.map(
                function(a, i){
                return (
                    <Link to={'/detail/'+ a._id} key={a._id} style={{textDecoration: 'none', color: 'black'}}>
                      <Card 
                        photo={a.productPhoto && a.productPhoto} 
                        brand={'MONCLER'}
                        title={a.productTitle}
                        size ={a.childAge} 
                        price={a.productPrice}
                      />
                    </Link>
                )
              })
          }
        </div>
        <img 
          src='./img/Carousel_right.svg' 
          onClick={()=>nextSlide()}
          className="SliderButton right"
        />
      </div>
    );
}

export default Slider;
