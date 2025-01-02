import {useState, useEffect} from 'react';
import './style/SignUp.css';

function SignUp(){
    let [new_userName, setUserName]=useState(''); // 실시간 입력값 받아오기
    let [new_userPassword, setUserPassword]=useState('');
    let [new_userNickName, setUserNickName]=useState('');
    
    function SignUp_MINIQUE(){
        fetch('/signUp-POST', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: new_userNickName ,username: new_userName, password: new_userPassword })
        })
        .then(response => response.json())
        .then(data => {
        console.log('서버 응답:', data);
        })
        .catch(error => {
        console.error('fetch 오류:', error);
        });
    }
    return(
        <div>
            <div className='SignUp-Title'>회원가입 페이지</div>
            <input onChange={(e) => {
                setUserNickName(e.target.value);
            }} type="text"/>

            <input onChange={(e) => {
                setUserName(e.target.value);
            }} type="text"/>
            
            <input onChange={(e) => {
                setUserPassword(e.target.value);
            }} type="text"/>
            
            <button onClick={SignUp_MINIQUE}>회원가입</button>
        </div>
    );
}

export default SignUp;