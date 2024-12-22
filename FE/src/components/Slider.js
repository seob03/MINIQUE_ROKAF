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
    if (currentSlide >= TOTAL_SLIDES) { // 더 이상 넘어갈 슬라이드가 없으면 슬라이드를 초기화합니다.
      setCurrentSlide(0);
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide === 0) {
      setCurrentSlide(TOTAL_SLIDES);
    } else {
      setCurrentSlide(currentSlide - 1);
    }
  };

  useEffect(() => {
    slideRef.current.style.transition = "all 0.5s ease-in-out";
    slideRef.current.style.transform = `translateX(-${currentSlide}00%)`; // 백틱을 사용하여 슬라이드로 이동하는 애니메이션을 만듭니다.
  }, [currentSlide]);

  
  return (
      <div className="Container">
        <img 
        src='./img/Carousel_left.svg' 
        onClick={()=>prevSlide()}
        className="SliderButton"
        />
        <div className="SliderContainer" ref={slideRef}>
          {
              props.data.map(
                function(a, i){
                return (
                    <Link to={'/detail/'+ a._id} key={a._id} style={{textDecoration: 'none', color: 'black'}}>
                      <Card img = {a.photo && a.photo} 
                        brand={'MONCLER'}
                        title={a.title}
                        size={'52'} 
                        price={'39000'}
                      />
                    </Link>
                )
              })
          }
        </div>
        <img 
        src='./img/Carousel_right.svg' 
        onClick={()=>nextSlide()}
        className="SliderButton"
        />
      </div>
    );
}

export default Slider;
