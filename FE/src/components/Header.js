import './style/Header.css';
import SearchBar from './SearchBar';
import Image from 'react-bootstrap/Image';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeLogIn, changeIsOpen } from "../store/store.js";

function Header() {
  let isLoggedIn = useSelector((state) => { return state.isLoggedIn }) // 로그인 상태를 추적할 상태
  let isOpen = useSelector((state) => { return state.isOpen })
  let dispatch = useDispatch();
  let navigate = useNavigate();

  useEffect(() => {
    // 로그인 상태를 확인하기 위해 서버로 요청
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('/checkLogin');
        const result = await response.json();
        // 서버로부터 받은 로그인 여부에 따라 상태 설정
        dispatch(changeLogIn(result)); // 서버에서 반환한 값(true/false)
      } catch (error) {
        console.error('로그인 상태 확인 중 오류 발생:', error);
        dispatch(changeLogIn(false)); // 오류 발생 시 로그인되지 않은 상태로 처리
      }
    };
    checkLoginStatus(); // 컴포넌트가 마운트될 때 로그인 상태 확인
  }, [isLoggedIn]);

  function handleLogin() {
    dispatch(changeIsOpen(true));
  }

  async function handleLogOut() {
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

  function CategoryDropDown() {
    let [isDropDown, setDropDown] = useState(false)

    function handleClickContainer(){
      setDropDown(!isDropDown);
      setTimeout(() => {
        setDropDown(false);
      }, 1000);
    }

    function handleBlurContainer(){
      setTimeout(()=>{
        setDropDown(false)
      }, 200);
    }

    function handleMouseLeave(){
      setTimeout(() => {
          setDropDown(false);
      }, 200);
    }

    const menuItems=['BEST', 'GIRL', 'BOY'];

    return(
      <div style={{position: 'relative'}} onBlur={handleBlurContainer} 
        onMouseEnter={()=>{setDropDown(true);}} 
        onMouseLeave={handleMouseLeave}>
        <div className="Header-DropDown-Title">
          {isDropDown ? '▲' : '▼'}
          <div style={{width:'0.6rem'}}/>
          CATEGORY
        </div>
        {isDropDown && 
          <div className='Header-DropDown-Container'>
            {
              menuItems.map((list, i) => (
                <div 
                  className='Header-DropDown-Menu' 
                  style={{ 
                  borderBottom: i === menuItems.length - 1 ?
                    'none' : '0.5px solid #D9D9D9' 
                  }}
                  onClick={()=>navigate(`/category/${list.toLowerCase()}`)}
                >
                  {list}
                </div>
              ))
            }
          </div>
        }
      </div>
    )
  }

  function MyInfoDropDown() {
    let [isDropDown, setDropDown] = useState(false)

    function handleClickContainer(){
      setDropDown(!isDropDown);
      setTimeout(() => {
        setDropDown(false);
      }, 1000);
    }

    function handleBlurContainer(){
      setTimeout(()=>{
        setDropDown(false)
      }, 200);
    }

    function handleMouseLeave(){
      setTimeout(() => {
          setDropDown(false);
      }, 200);
    }

    return(
      (isLoggedIn) ? 
      <div style={{position: 'relative'}} onBlur={handleBlurContainer}
        onMouseEnter={()=>{setDropDown(true);}} 
        onMouseLeave={handleMouseLeave}>
        <div className="Header-DropDown-Title">
          <img src="/img/My_Info.svg"/>      
        </div>
        {isDropDown && 
          <div className='Header-InfoDropDown-Container'>
            <div 
              className='Header-InfoDropDown-Menu' 
              onClick={handleLogOut}
            >
              로그아웃
            </div>
            <div 
              className='Header-InfoDropDown-Menu' 
              onClick={()=>{navigate('/myStore')}}
            >
              내 정보
            </div>
          </div>
        }
      </div>
      : <div 
          onClick={handleLogin}
          style={{fontFamily: 'NotoSansKR-Medium', cursor: 'pointer'}}
        >
          로그인
        </div>
    )
  }

  return (
    <header className='Header'>
      <div className='Header-First'>
        <div className='Header-First-Logo'>
          <a href="/">
            <Image src="/img/Logo_horizontal.svg"/>
          </a>
        </div>
        <div className='Header-First-SearchBar'>
          <SearchBar />
        </div>
        <div className='Header-First-Menu'>
          <div className='Header-First-Menu-Buttons'>
            <CategoryDropDown/>
          </div>
          <div className='Header-First-Menu-Buttons'>
            <Link to="/chatList" className='Header-Menu-Link'>채팅내역</Link>
          </div>
          <div className='Header-First-Menu-Buttons'>
            {(isLoggedIn) ?
              <Link to="/write" className='Header-Menu-Link'>판매하기</Link> :
              <Link onClick={handleLogin} className='Header-Menu-Link'>판매하기</Link>}
          </div>
          <div className='Header-First-Menu-Buttons'>
            <MyInfoDropDown/>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;