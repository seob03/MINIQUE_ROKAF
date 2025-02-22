import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeLogIn, changeIsOpen, changeIsSignUpOpen } from "../store/store.js";
import './style/LoginModal.css';
import { SignUpButton } from './Buttons.js';

function LoginModal(props) {
    let [input_userName, setUserName] = useState(''); // 실시간 입력값 받아오기
    let [input_userPassword, setUserPassword] = useState('');

    let isOpen = useSelector((state) => { return state.isOpen })
    let dispatch = useDispatch();

    function handletoSignUp() {
        dispatch(changeIsOpen(false));
        dispatch(changeIsSignUpOpen(true));
    }

    function handleLogin() {
        fetch('/tryLogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: input_userName, password: input_userPassword }),
            withCredentials: true
        })
            .then(response => response.json())
            .then(data => {
                console.log('서버 응답:', data);
                alert(data.message)
                dispatch(changeLogIn(true));
                dispatch(changeIsOpen(false));
            })
            .catch(error => {
                alert('로그인에 실패하였습니다.')
                console.error('fetch 오류:', error);
            });
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    }

    function LoginButton(props) {
        return (
            <div className={`LoginButton ${(input_userName && input_userPassword) ? 'active' : ''}`} onClick={props.eventHandler}>
                로그인
            </div>
        );
    }

    return (
        (isOpen) ?
            <div className='LoginModal-Wrapper'>
                <div className='LoginModal-Background' />
                <div className='LoginModal-Container'>
                    <div className='LoginModal-FirstLine'>
                        <img src={'/img/CloseButton.svg'}
                            className='LoginModalCloseButton'
                            onClick={() => { dispatch(changeIsOpen(false)); }}
                        />
                    </div>
                    <div className='LoginModal-Title'>
                        <img src={'/img/Logo_Square.svg'} style={{ width: '40px', height: '40px', marginBottom: '20px' }} />
                        합리적인 패션 첫걸음, MINIQUE
                    </div>
                    <div className='LoginModal-SubTitle'>
                        로그인하여 거래를 시작하세요!
                    </div>
                    <div className='LoginModal-Input-Area'>
                        <div className='LoginModal-Input-Label'>
                            ID
                            <div style={{ flexGrow: 1 }}></div>
                        </div>
                        <input
                            onChange={(e) => { setUserName(e.target.value); }}
                            onKeyDown={handleKeyDown}
                            type="text"
                            className='LoginModal-Input'
                        />
                    </div>
                    <div className='LoginModal-Input-Area'>
                        <div className='LoginModal-Input-Label'>
                            PW
                            <div style={{ flexGrow: 1 }}></div>
                        </div>
                        <input
                            onChange={(e) => { setUserPassword(e.target.value); }}
                            onKeyDown={handleKeyDown}
                            type="password"
                            className='LoginModal-Input'
                        />
                    </div>
                    <LoginButton eventHandler={handleLogin} />
                    <SignUpButton eventHandler={handletoSignUp} />
                </div>
            </div>
            : null
    );
}

export default LoginModal;