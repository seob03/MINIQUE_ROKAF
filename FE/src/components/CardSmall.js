import { useNavigate } from 'react-router-dom';

import './style/CardSmall.css';

function CardSmall(props) {
    let navigate = useNavigate();

    return (
        <div className="CardSmallContainer" onClick={() => { navigate(props.link); window.scrollTo({left:0, top:0})}}>
            <div className="CardSmall-Image">
                <img src={Array.isArray(props.photo) ? props.photo[0] : props.photo}
                    className="CardSmall-Image cover" />
            </div>
            <div className="Card-First">
                <div>
                    {props.brand ? props.brand : 'NO BRAND'}
                </div>
                <div style={{ flexGrow: 1 }}>
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