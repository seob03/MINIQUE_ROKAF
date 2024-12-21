import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

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

    return (
    <>
      <div>리스트 페이지임</div>
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
    </>
    );
}

export default NewsList;