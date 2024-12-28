import {useState} from 'react';
import { Link , useNavigate} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { changeLogIn } from "../store/store.js";

function Login(){
    let [input_userName, setUserName]=useState(''); // 실시간 입력값 받아오기
    let [input_userPassword, setUserPassword]=useState('');

    let navigate = useNavigate();
    let dispatch = useDispatch();

    function handleLogin(){
        console.log("LoginMINIQUE 실행 성공")
        fetch('/login-POST', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username: input_userName, password: input_userPassword}),
        withCredentials: true 
        })
        .then(response => response.json())
        .then(data => {
        console.log('서버 응답:', data);
        dispatch(changeLogIn(true));
        navigate(-1);
        })
        .catch(error => {
        console.error('fetch 오류:', error);
        });
    }

    return(
        <>
            <div>로그인페이지</div>
            <input onChange={(e) => {
                setUserName(e.target.value);
            }} type="text"/>
            
            <input onChange={(e) => {
                setUserPassword(e.target.value);
            }} type="text"/>
            
            <button onClick={handleLogin}>로그인</button>
            <button onClick={console.log('회원가입 페이지 입장합니다.')}>
                <Link to= "/signUp" style={{textDecoration: 'none', color: '#212120'}}>
                    회원가입
                </Link>
            </button>
        </>
    );
}

export default Login;