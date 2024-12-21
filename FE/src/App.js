import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import NewsList from './pages/NewsList';
import NewsWrite from './pages/NewsWrite';
import Detail from './pages/Detail';
import Login from './pages/Login';
import SignUp from './pages/SignUp';




function App() {
  let currentDate = new Date();
  let [title, setTitle] = useState([]); // 최종 입력값
  let [입력값, 입력값변경]=useState(''); // 실시간 입력값 받아오기

  function DeleteNews(i){
    let copy = [...title];
    copy.splice(i, 1);
    setTitle(copy);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Header/>
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
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/detail/:id" element={<Detail/>}/>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
