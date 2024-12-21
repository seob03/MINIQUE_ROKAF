import {useState, useEffect} from 'react';

function SignUp(){
    let [userid, setUserID]=useState(''); // 실시간 입력값 받아오기
    let [password, setPassword]=useState('');

    return(
        <>
            <div>회원가입 페이지</div>
            <input onChange={(e) => {
                setUserID(e.target.value);
            }} type="text"/>
            
            <input onChange={(e) => {
                setPassword(e.target.value);
            }} type="text"/>
            
            <button onClick={console.log('회원가입')}>회원가입</button>
        </>
    );
}

export default SignUp;