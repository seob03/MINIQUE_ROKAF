import { Routes, Route } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import NewsList from './pages/NewsList';
import NewsWrite from './pages/NewsWrite';
import UserDetail from './pages/UserDetail';
import Detail from './pages/Detail';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import LoginModal from './components/LoginModal';
import SignUpModal from './components/SignUpModal';
import SearchResult from './pages/SearchResult';
import SetUserInfo from './pages/SetUserInfo';
import EditNews from './pages/EditNews';
import ChatDetail from './pages/ChatDetail';
import ChatList from './pages/ChatList';
import MyDetail from './pages/MyDetail';
import Footer from './components/Footer';

function App() {
  return (
    <div className='App'>
      <div className='App-content'>
        <div style={{ display: 'flex',
        justifyContent: 'center',
        alignItems: 'center' 
        }}>
          <Header />
        </div>
        <div style={{
          display: 'flex', justifyContent: 'center', flex: 1,
          width: '1024px', margin: '0 auto'
        }}>
          <LoginModal />
          <SignUpModal />
          <div style={{ width: '1024px' }}>
            <Routes>
              <Route path="/" element={<NewsList />} />
              <Route path="/write" element={<NewsWrite />} />
              <Route path="/edit/:id" element={<EditNews />} />
              <Route path="/detail" element={<Detail />} />
              <Route path="/store/:user_id" element={<UserDetail />} />
              <Route path="/myStore" element={<MyDetail/>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signUp" element={<SignUp />} />
              <Route path="/updateInfo" element={<SetUserInfo />} />
              <Route path="/search" element={<SearchResult />} />
              <Route path="/detail/:id" element={<Detail />} />
              <Route path="/chat/:chatRoomId" element={<ChatDetail />} />
              <Route path="/chatList" element={<ChatList/>} />
            </Routes>
          </div>
        </div>
      </div>
      <div className="Footer-Container">
        <Footer/>
      </div>
    </div>
  );
}

export default App;
