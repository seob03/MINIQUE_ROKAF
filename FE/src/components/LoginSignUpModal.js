import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeLogIn, changeIsOpen, changeIsSignUpOpen } from "../store/store.js";
import { SignUpButton } from './Buttons.js';
import './style/LoginModal.css';
import './style/SignUpModal.css';

function LoginSignUpModal(props) {
    let [input_userName, setUserName] = useState(''); // 실시간 입력값 받아오기
    let [input_userPassword, setUserPassword] = useState('');

    let [new_userNickName, setNewUserNickName] = useState(''); // 실시간 입력값 받아오기
    let [new_userID, setNewUserID] = useState('');
    let [new_userPassword, setNewUserPassword] = useState('');
    let [new_userPasswordCheck, setNewUserPasswordCheck] = useState('');

    let isOpen = useSelector((state) => { return state.isOpen })
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


}