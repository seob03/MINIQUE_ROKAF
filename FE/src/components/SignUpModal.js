import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeIsSignUpOpen } from "../store/store.js";
import './style/SignUpModal.css';
import { showAlert } from './Util.js';

function SignUpModal() {
    let [new_userID, setUserID] = useState('');
    let [new_userPassword, setUserPassword] = useState('');
    let [new_userPasswordCheck, setUserPasswordCheck] = useState('');

    let isSignUpOpen = useSelector((state) => { return state.isSignUpOpen })
    let dispatch = useDispatch();
    let navigate = useNavigate();

    function SignUpButton(props) {
        let isEverythingOk =
            new_userID &&
            new_userPassword &&
            (new_userPassword == new_userPasswordCheck)
            ;

        return (
            <div className={`SignUpButton ${(isEverythingOk) ? 'active' : ''}`} onClick={(isEverythingOk) ? props.eventHandler : null}>
                회원가입
            </div>
        );
    }
    function SignUp() {
        fetch('/trySignUp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: new_userID, password: new_userPassword })
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.message); });
                }
                return response.json();
            })
            .then(data => {
                showAlert({
                    title: '🎊 환영합니다 🎊',
                    text: '회원가입이 성공적으로 완료되었습니다.',
                    icon: 'success'
                }).then(() => {
                    dispatch(changeIsSignUpOpen(false));
                    navigate(0)
                });
                console.log('서버 응답:', data);
            })
            .catch(error => {
                showAlert({
                    title: '회원가입 실패',
                    text: error.message,
                    icon: 'error'
                });
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
                            ID
                            <div style={{ flexGrow: 1 }}></div>
                        </div>
                        <input onChange={(e) => { setUserID(e.target.value); }}
                            type="text"
                            className='SignUpModal-Input'
                            placeholder='4자 이상 20자 이하'

                        />
                    </div>
                    <div className='SignUpModal-Input-Area'>
                        <div className='SignUpModal-Input-Label'>
                            Password
                            <div style={{ flexGrow: 1 }}></div>
                        </div>
                        <input onChange={(e) => { setUserPassword(e.target.value); }}
                            type="password"
                            className='SignUpModal-Input'
                            placeholder='8자 이상 20자 이하'
                        />
                    </div>
                    <div className='SignUpModal-Input-Area'>
                        <div className='SignUpModal-Input-Label'>
                            Password Check
                            <div style={{ flexGrow: 1 }}></div>
                        </div>
                        <input onChange={(e) => { setUserPasswordCheck(e.target.value); }}
                            type="password"
                            className='SignUpModal-Input'
                            placeholder='설정한 비밀번호를 확인해보세요!'
                        />
                    </div>
                    <SignUpButton eventHandler={SignUp} />
                </div>
            </div>
            : null
    );
}

export default SignUpModal;