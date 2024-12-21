import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import './NewsList.css';

function NewsList(){
    let navigate = useNavigate();
    let [postData, setpostData] = useState([]); // 최종 입력값
    // 백엔드에서 데이터 가져오기 (MS)
    useEffect(() => {
      fetch('/getDatabase')
        .then((response) => response.json())
        .then((result) => {
          setpostData(result);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        }, []);
    }, []);  // 컴포넌트가 마운트될 때 한 번만 실행

    let today = new Date();
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3
    };

    return (
    <div>
      <div>
        <div className="Recommend-Title">
          {today.getMonth()+1}월의 추천 상품
        </div>
        <div className="Recommend-Carousel">
          <div className="Recommend-Container">
            <img src='./img/Carousel_left.svg' className='Recomment-Button'/>
            <div className="Card">1</div>
            <div className="Card">2</div>
            <div className="Card">3</div>
            <div className="Card">4</div>
            <div className="Card">5</div>
            <div className="Card">6</div>
            <div className="Card">7</div>
            <div className="Card">8</div>
            <img src='./img/Carousel_right.svg' className='Recomment-Button'/>
          </div>
          {
              postData.map(function(a, i){
                return (
                  <div className="list">
                    <h4 onClick={()=>{
                      navigate('/detail/'+ a._id)
                    }}>
                      제목 : {a.title}
                      {a.photo && <img src={a.photo} alt="Preview" style={{ maxWidth: '200px', margin: '10px 0' }} />}
                    </h4>
                  </div>
                )
              })
          }
          </div>
      </div>
      <div>
        <div className="Recommend-Title">
          지금, 회원님의 지역 상품
        </div>
        <div className="Recommend-Container"></div>
      </div>
    </div>
    );
}

export default NewsList;