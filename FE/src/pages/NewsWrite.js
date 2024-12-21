import {useState} from 'react';

function NewsWrite() {
    let [제목, 제목변경]=useState(''); // 실시간 입력값 받아오기
    let [내용, 내용변경]=useState(''); // 실시간 입력값 받아오기
    let [이미지, 이미지변경] = useState(null); // BASE64 데이터

    function PostNews(){
        fetch('/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 제목, content: 내용, photo: 이미지 })
        })
        .then(response => response.json())
        .then(data => {
        console.log('서버 응답:', data);
        })
        .catch(error => {
        console.error('fetch 오류:', error);
        });
    }
    // 파일 선택 핸들러
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            이미지변경(reader.result); // BASE64 데이터 저장
        };
        reader.readAsDataURL(file); // 파일을 BASE64로 변환
        }
    };

    return (
        <>
            <div>글쓰기페이지</div>
            <input onChange={(e) => {
                제목변경(e.target.value);
            }} type="text"/>
            
            <input onChange={(e) => {
                내용변경(e.target.value);
            }} type="text"/>
            

            <div>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {이미지 && <img src={이미지} alt="Preview" style={{ maxWidth: '200px', margin: '10px 0' }} />}
            </div>
            <button onClick={PostNews}>글쓰기</button>
        </>
    );
}

export default NewsWrite;