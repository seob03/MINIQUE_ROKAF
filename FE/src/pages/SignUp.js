import {useState, useEffect} from 'react';

function SignUp(){
    let [new_userName, setUserName]=useState(''); // 실시간 입력값 받아오기
    let [new_userPassword, setUserPassword]=useState('');
    
    function SignUp_MINIQUE(){
        fetch('/signUp-POST', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: new_userName, password: new_userPassword })
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
        <>
            <div>회원가입 페이지</div>
            <input onChange={(e) => {
                setUserName(e.target.value);
            }} type="text"/>
            
            <input onChange={(e) => {
                setUserPassword(e.target.value);
            }} type="text"/>
            
            <button onClick={SignUp_MINIQUE}>회원가입</button>
        </>
    );
}

export default SignUp;