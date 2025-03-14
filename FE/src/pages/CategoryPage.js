import { useState, useEffect, useRef } from 'react';
import './style/NewsList.css';
import CardSmall from '../components/CardSmall';
import CategoryDropDown from '../components/CategoryDropDown';

function CategoryPage() {
    let [상위카테고리, 상위카테고리변경] = useState('');
    let [하위카테고리, 하위카테고리변경] = useState('');
    let [카테고리게시글, 카테고리게시글변경] = useState('');

    // 상위 카테고리 불러오기 
    useEffect(() => {
        console.log('상위카테고리 useEffect 실행')
        fetch(`/category/getHigherPosts?higherCategory=${상위카테고리}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => {
                console.log('상위카테고리:', data)
                상위카테고리변경(상위카테고리);
                카테고리게시글변경(data);
            })
            .catch(error => console.error("이전 채팅 fetch 오류:", error));
    }, [상위카테고리])


    const isFirstRender = useRef(true); // 첫 실행 여부를 저장할 ref
    // 하위 카테고리 불러오기
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false; // 첫 실행을 무시하고, 다음부터 실행되도록 설정
            return;
        }
        console.log('하위카테고리 useEffect 실행');
        const params = new URLSearchParams({
            higherCategory: 상위카테고리,
            lowerCategory: 하위카테고리
        });
        fetch(`/category/getLowerPosts?${params.toString()}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => {
                console.log('하위카테고리:', data);
                카테고리게시글변경(data);
            })
            .catch(error => console.error("fetch 오류:", error));
    }, [하위카테고리]);


    return (
        <>
            <div style={{ marginTop: '30px' }}>
                <CategoryDropDown isActive_1={true}
                    상위카테고리={상위카테고리} 상위카테고리변경={상위카테고리변경}
                    하위카테고리={하위카테고리} 하위카테고리변경={하위카테고리변경}
                />
            </div>
            {
            (상위카테고리 == '' && 하위카테고리 == '') ? 
                <>
                    <div className="Recommend-Title">
                        BEST
                    </div>
                    <div className="Recommend-Gallery">
                        
                    </div>
                </>
            :
            <div>
                <div>
                    {
                        (카테고리게시글.length > 0) ? (
                            카테고리게시글.map(post => (
                                <CardSmall
                                    photo={post.productPhoto || undefined}
                                    brand={'MONCLER'}
                                    title={post.productName}
                                    size={post.childAge}
                                    price={Number(post.productPrice).toLocaleString()}
                                    link={'/detail/' + post._id}
                                />
                            ))
                        ) : <div>해당 카테고리 상품이 없습니다.</div>
                    }
                </div>
            </div>
            }
        </>
    );
}
export default CategoryPage;