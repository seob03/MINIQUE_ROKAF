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

export function ButtonMedium(props){
    return(
        <div className='ButtonMedium' onClick={props.eventHandler}>
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
