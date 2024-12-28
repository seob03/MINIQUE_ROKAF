import './style/Button.css';

export function ButtonSmall(props){
    return(
    <div className='ButtonSmall'>
        {props.text}
    </div>
    );
}

export function DeleteButton(props){
    return(
    <div className='DeleteButton' onClick={this.props.customClickEvent}>
        삭제
    </div>
    );
}

export function ButtonMedium(){
    return(
        <div>
    
        </div>
    );
}
