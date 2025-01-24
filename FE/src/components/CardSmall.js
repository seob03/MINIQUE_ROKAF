import { useNavigate } from 'react-router-dom';

import './style/CardSmall.css';

function CardSmall(props){
    let navigate = useNavigate();
    return (
        <div className="CardSmallContainer" onClick={()=>{navigate(props.link)}}>
            <div className="CardImage" 
                style={{backgroundImage: `url(${props.img})`}}
            >
                <img src={props.photo} className="CardImage cover"/>
            </div>
            <div className="Card-First">
                <div>
                    {props.brand}
                </div>
                <div style={{flexGrow:1}}>
                </div>
                <div>
                    {props.size}개월
                </div>
            </div>
            <div className="Card-Title">
                {props.title}
            </div>
            <div className="Card-Price">
                {props.price}원
            </div>
        </div>
    );
}

export default CardSmall;