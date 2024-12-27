import {useEffect, useState} from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import NewsList from './pages/NewsList';
import NewsWrite from './pages/NewsWrite';
import Detail from './pages/Detail';
import Login from './pages/Login';
import SignUp from './pages/SignUp';


function App() {
  let [isLoggedIn, setIsLoggedIn] = useState(null); // 로그인 상태를 추적할 상태
  useEffect(() => {
      // 로그인 상태를 확인하기 위해 서버로 요청
      const checkLoginStatus = async () => {
        try {
          const response = await fetch('/checkLogin');
          const result = await response.json();
          console.log('로그인 여부 확인 : ', result)
          // 서버로부터 받은 로그인 여부에 따라 상태 설정
          setIsLoggedIn(result); // 서버에서 반환한 값(true/false)
        } catch (error) {
          console.error('로그인 상태 확인 중 오류 발생:', error);
          setIsLoggedIn(false); // 오류 발생 시 로그인되지 않은 상태로 처리
        }
      };
      checkLoginStatus(); // 컴포넌트가 마운트될 때 로그인 상태 확인
    }, []);


  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Header isLoggedIn={isLoggedIn}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', flex: 1,
        width: '1024px', margin: '0 auto'
      }}>
        <div style={{width:'1024px'}}>
          <Routes>
            <Route path="/" element={<NewsList/>}/>
            <Route path="/write" element={<NewsWrite/>}/>
            <Route path="/detail" element={<Detail/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signUp" element={<SignUp/>}/>
            <Route path="/detail/:id" element={<Detail/>}/>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
