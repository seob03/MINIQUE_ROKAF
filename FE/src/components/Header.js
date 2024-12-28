import './style/Header.css';
import SearchBar from './SearchBar';
import Image from 'react-bootstrap/Image';
import {Link} from 'react-router-dom';
import {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeLogIn } from "../store/store.js";

function Header() {
  let isLoggedIn = useSelector((state) => {return state.isLoggedIn}) // 로그인 상태를 추적할 상태
  let dispatch = useDispatch();
  
  useEffect(() => {
      // 로그인 상태를 확인하기 위해 서버로 요청
      const checkLoginStatus = async () => {
        try {
          const response = await fetch('/checkLogin');
          const result = await response.json();
          console.log('로그인 여부 확인 : ', result)
          // 서버로부터 받은 로그인 여부에 따라 상태 설정
          dispatch(changeLogIn(result)); // 서버에서 반환한 값(true/false)
        } catch (error) {
          console.error('로그인 상태 확인 중 오류 발생:', error);
          dispatch(changeLogIn(false)); // 오류 발생 시 로그인되지 않은 상태로 처리
        }
      };
        checkLoginStatus(); // 컴포넌트가 마운트될 때 로그인 상태 확인
        console.log('isLoggedIn 상태가 변경됨:', isLoggedIn);
  }, [isLoggedIn]); 

  async function handleLogOut(){
    try {
      // 로그아웃 요청 보내기
      const response = await fetch('/logOut', {
        method: 'POST',
        credentials: 'same-origin', // 세션 쿠키가 포함되도록 설정
      });

      if (response.ok) {
        dispatch(changeLogIn(false));
      } else {
        alert('로그아웃 실패');
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
      alert('로그아웃 실패');
    }
  }

  return (
    <header className='Header'>
      <div className='Header-Top'>
        <div style={{ flexGrow: 1 }}></div>
        <div className='Header-Top-Right'>
          <div className='Header-Top-Buttons'>
          {(isLoggedIn) ?
            <div onClick={handleLogOut} style={{cursor: 'pointer'}}>로그아웃</div> :
            <Link to="/login" style={{textDecoration: 'none', color: '#212120'}}>로그인</Link>
          }
          </div>
          <div className='Header-Top-Buttons'>내정보 </div>
        </div>
      </div>
      <div className='Header-First'>
        <div className='Header-First-Logo'>
          <a href="/">
            <Image src="./img/Logo_horizontal.svg" />
          </a>
        </div>
        <div className='Header-First-SearchBar'>
          <SearchBar />
        </div>
        <div className='Header-First-Menu'>
          <div className='Header-First-Menu-Buttons'>
            <Link to="/" style={{textDecoration: 'none', color: 'black'}}>채팅내역</Link>
          </div>
          <div className='Header-First-Menu-Buttons'>
          {(isLoggedIn) ?
            <Link to="/write" style={{textDecoration: 'none', color: 'black'}}>판매하기</Link> : 
            <Link to="/login" style={{textDecoration: 'none', color: 'black'}}>판매하기</Link>}
          </div>
          <div className='Header-First-Menu-Buttons'>
            <Link to="/" style={{textDecoration: 'none', color: 'black'}}>내 상점</Link>
          </div>
        </div>
      </div>
      <div className='Header-Second-Menu'>
        <div className='Header-Second-Menu-Buttons'>BEST</div>
        <div className='Header-Second-Menu-Buttons'>GIRLS</div>
        <div className='Header-Second-Menu-Buttons'>BOYS</div>
      </div>
    </header>
  );
}

export default Header;