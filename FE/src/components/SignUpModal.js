import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeLogIn, changeIsOpen, changeIsSignUpOpen } from "../store/store.js";
import './style/SignUpModal.css';

function SignUpModal(props) {
    let [new_userNickName, setUserNickName] = useState(''); // 실시간 입력값 받아오기
    let [new_userID, setUserID] = useState('');
    let [new_userPassword, setUserPassword] = useState('');
    let [new_userPasswordCheck, setUserPasswordCheck] = useState('');

    let isSignUpOpen = useSelector((state) => { return state.isSignUpOpen })
    let dispatch = useDispatch();
    let navigate = useNavigate();

    function SignUpButton(props) {
        let isEverythingOk =
            new_userNickName &&
            new_userID &&
            new_userPassword &&
            (new_userPassword == new_userPasswordCheck)
            ;

        return (
            <div className={`SignUpButton ${(isEverythingOk) ? 'active' : ''}`} onClick={props.eventHandler}>
                회원가입
            </div>
        );
    }

    function SignUp_MINIQUE() {
        fetch('/signUp-POST', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nickname: new_userNickName, username: new_userID, password: new_userPassword })
        })
            .then(response => response.json())
            .then(data => {
                console.log('서버 응답:', data);
                navigate('/updateInfo');
            })
            .catch(error => {
                console.error('fetch 오류:', error);
            });
    }

    return (
        (isSignUpOpen) ?
            <div className='SignUpModal-Wrapper'>
                <div className='SignUpModal-Background' />
                <div className='SignUpModal-Container'>
                    <div className='SignUpModal-FirstLine'>
                        <img src={'/img/CloseButton.svg'}
                            className='SignUpModalCloseButton'
                            onClick={() => { dispatch(changeIsSignUpOpen(false)); }}
                        />
                    </div>
                    <div className='SignUpModal-Title'>
                        <img src={'/img/Logo_Square.svg'} style={{ width: '40px', height: '40px', marginBottom: '20px' }} />
                        합리적인 패션 첫걸음, MINIQUE
                    </div>
                    <div className='SignUpModal-SubTitle'>
                        MINIQUE의 회원이 되어주셔서 감사합니다.
                    </div>
                    <div className='SignUpModal-Input-Area'>
                        <div className='SignUpModal-Input-Label'>
                            Nickname
                            <div style={{ flexGrow: 1 }}></div>
                        </div>
                        <input
                            onChange={(e) => { setUserNickName(e.target.value); }}
                            type="text"
                            className='SignUpModal-Input'
                        />
                    </div>
                    <div className='SignUpModal-Input-Area'>
                        <div className='SignUpModal-Input-Label'>
                            ID
                            <div style={{ flexGrow: 1 }}></div>
                        </div>
                        <input onChange={(e) => { setUserID(e.target.value); }}
                            type="text"
                            className='SignUpModal-Input'
                        />
                    </div>
                    <div className='SignUpModal-Input-Area'>
                        <div className='SignUpModal-Input-Label'>
                            Password
                            <div style={{ flexGrow: 1 }}></div>
                        </div>
                        <input onChange={(e) => { setUserPassword(e.target.value); }}
                            type="text"
                            className='SignUpModal-Input'
                        />
                    </div>
                    <div className='SignUpModal-Input-Area'>
                        <div className='SignUpModal-Input-Label'>
                            Password Check
                            <div style={{ flexGrow: 1 }}></div>
                        </div>
                        <input onChange={(e) => { setUserPasswordCheck(e.target.value); }}
                            type="text"
                            className='SignUpModal-Input'
                        />
                    </div>
                    <SignUpButton eventHandler={SignUp_MINIQUE} />
                </div>
            </div>
            : null
    );
}

export default SignUpModal;