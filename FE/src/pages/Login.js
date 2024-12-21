import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

function Login(){
    let [userid, setUserID]=useState(''); // 실시간 입력값 받아오기
    let [password, setPassword]=useState('');

    return(
        <>
            <div>로그인페이지</div>
            <input onChange={(e) => {
                setUserID(e.target.value);
            }} type="text"/>
            
            <input onChange={(e) => {
                setPassword(e.target.value);
            }} type="text"/>
            
            <button onClick={console.log('로그인')}>로그인</button>
            <button onClick={console.log('회원가입')}>
                <Link to= "/signup" style={{textDecoration: 'none', color: '#212120'}}>
                    회원가입
                </Link>
            </button>
        </>
    );
}

export default Login;