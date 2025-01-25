import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from 'react';

import './style/DetailSlider.css';

function DetailSlider(props){
    const [currentSlide, setCurrentSlide] = useState(0);
    const TOTAL_SLIDES = props.data?.length || 0;
    const slideRef = useRef(null);

    console.log(TOTAL_SLIDES);
    const nextSlide = () => {
        if(currentSlide >= TOTAL_SLIDES-1){
            setCurrentSlide(0);
        } else {
            setCurrentSlide(currentSlide+1);
            console.log(currentSlide);
        }
    };

    const prevSlide = () => {
        if(currentSlide === 0){
            setCurrentSlide(TOTAL_SLIDES-1);
        } else {
            setCurrentSlide(currentSlide - 1);
            console.log(currentSlide);
        }
    };

    useEffect(()=> {
        if (slideRef.current) {
        slideRef.current.style.transition = "all 0.5s ease-in-out";
        slideRef.current.style.transform = `translateX(-${currentSlide*100}%)`;
        }
    }, [currentSlide])

    return(
        <div className="DetailSlider-Container">
            <img 
                src='/img/Carousel_left.svg' 
                onClick={()=>prevSlide()}
                className="SliderButton-left"
            />
            <div className="ImageContainer"  ref={slideRef}>
                {
                    props.data.map(
                        function(a,i){
                            return (
                                <img src={a} key={i} className="ImageContainer cover"/>
                            )
                        }
                    )
                }
            </div>
            <img 
                src='/img/Carousel_right.svg' 
                onClick={()=>nextSlide()}
                className="SliderButton-right"
            />
        </div>
    )
}

export default DetailSlider;