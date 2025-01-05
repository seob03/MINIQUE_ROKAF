import './style/Button.css';

export function ButtonSmall(props){
    return(
    <div className='ButtonSmall' onClick={props.eventHandler}>
        {props.text}
    </div>
    );
}

export function DeleteButton(props){    
    return(
    <div className='DeleteButton' onClick={props.eventHandler}>
        삭제
    </div>
    );
}

export function DeleteButtonHalf(props){    
    return(
    <div className='DeleteButtonHalf' onClick={props.eventHandler}>
        삭제
    </div>
    );
}

export function BuyButton(props){    
    return(
    <div className='BuyButton' onClick={props.eventHandler}>
        구매하기
    </div>
    );
}

export function ButtonMedium(props){
    return(
        <div className='ButtonMedium' onClick={props.eventHandler}>
            {props.text}
        </div>
    );
}

export function ButtonMediumBlue(props){
    return(
        <div className='ButtonMediumBlue' onClick={props.eventHandler}>
            {props.text}
        </div>
    );
}

export function ButtonMediumGray(props){
    return(
        <div className='ButtonMediumGray' onClick={props.eventHandler}>
            {props.text}
        </div>
    );
}

export function SignUpButton(props){
    return(
        <div className='SignUpButton' onClick={props.eventHandler}>
            회원가입
        </div>
    );
}
