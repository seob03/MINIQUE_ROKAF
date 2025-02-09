import './style/Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <div className='Footer'>
            <div className='Footer-List'>
                <Link to="#" className='Footer-Link'>
                    자주 묻는 질문
                </Link>
                <Link to="#" className='Footer-Link'>
                    문의하기
                </Link>
                <Link to="#" className='Footer-Link'>
                    이용약관
                </Link>
                <Link to="#" className='Footer-Link'>
                    개인정보관리방침
                </Link>
            </div>
            <div className='Footer-Logo'>
                <Link to="/">
                    <img src={'/img/Logo_Square.svg'} />
                </Link>
            </div>
            <div className='Footer-Message'>
                <div>
                    Copyright © Hotte00, Seob03 in ROKAF. All right reserved
                </div>
                <div>
                    해당 웹 페이지는 김호준, 이민섭에 의해 제작된 토이프로젝트이며, 제작자는 법적 책임을 지지 않습니다.
                </div>
            </div>
        </div>
    )
}

export default Footer;