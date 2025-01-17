import {useState, useEffect} from 'react';
import Slider from '../components/Slider';
import './style/NewsList.css';

function NewsList(){
    let [postData, setpostData] = useState([]); // 최종 입력값
    // 백엔드에서 데이터 가져오기
    useEffect(() => {
      fetch('/getDatabase')
        .then((response) => response.json())
        .then((DB_result) => {
          setpostData(DB_result);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        }, []);
    }, []);  // 컴포넌트가 마운트될 때 한 번만 실행

    let today = new Date();

    return (
    <div>
      <div>
        <div className="Recommend-Title">
          {today.getMonth()+1}월의 추천 상품
        </div>
        <div className="Recommend-Carousel">
          <div className="Recommend-Container">
            <Slider data={postData}/>
          </div>
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