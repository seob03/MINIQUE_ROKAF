import './Header.css';
import SearchBar from './SearchBar';
import Image from 'react-bootstrap/Image';
import {Link} from 'react-router-dom';

function Header() {
  return (
    <header className='Header'>
      <div className='Header-Top'>
        <div style={{ flexGrow: 1 }}></div>
        <div className='Header-Top-Right'>
          <div className='Header-Top-Buttons'>로그아웃</div>
          <div className='Header-Top-Buttons'>내정보 </div>
        </div>
      </div>
      <div className='Header-First'>
        <div className='Header-First-Logo'>
          <a href="#">
            <Image src="./img/Logo_horizontal.svg" />
          </a>
        </div>
        <div className='Header-First-SearchBar'>
          <SearchBar />
        </div>
        <div className='Header-First-Menu'>
          <div className='Header-First-Menu-Buttons'>
            <Link href="/" style={{textDecoration: 'none', color: 'black'}}>채팅내역</Link>
          </div>
          <div className='Header-First-Menu-Buttons'>
            <Link href="/" style={{textDecoration: 'none', color: 'black'}}>판매내역</Link>
          </div>
          <div className='Header-First-Menu-Buttons'>
            <Link href="/" style={{textDecoration: 'none', color: 'black'}}>내 상점</Link>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', margintop: '20px' }}>
        <div>BEST</div>
        <div>GIRLS</div>
        <div>BOYS</div>
      </div>
    </header>
  );
}

export default Header;