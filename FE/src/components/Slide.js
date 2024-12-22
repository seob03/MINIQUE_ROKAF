import React from "react";
import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from '../components/Card';
import './Slide.css';

const TOTAL_SLIDES = 1;

function Slider(props){
  const [currentSlide, setCurrentSlide] = useState(0);
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
            {/* <Card img={'https://picsum.photos/240/240'} 
              brand={'MONCLER'}
              title={'a.title'}
              size={'52'} 
              price={'39000'}/>
            <Card img={'https://picsum.photos/240/240'} 
              brand={'Polo Ralph Lauren'}
              title={'폴로 여아 셔츠 팔아요'}
              size={'64'} 
              price={'32000'}/>
            <Card img={'https://picsum.photos/240/240'} 
              brand={'Polo Ralph Lauren'}
              title={'폴로 남아 셔츠 팔아요'}
              size={'58'} 
              price={'32000'}/> */}
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
