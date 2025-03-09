import { useState, useEffect, useRef } from 'react';
import './style/NewsList.css';
import { useParams } from 'react-router-dom';
import CardSmall from '../components/CardSmall';
import CategoryDropDown from '../components/CategoryDropDown';

function CategoryPage() {
    let [상위카테고리, 상위카테고리변경] = useState('');
    let [하위카테고리, 하위카테고리변경] = useState('');
    let [카테고리게시글, 카테고리게시글변경] = useState('');
    let { cat } = useParams();

    // 상위 카테고리 불러오기
    useEffect(() => {
        console.log('상위카테고리 useEffect 실행')
        fetch(`/category/getHigherPosts?higherCategory=${cat}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => {
                console.log('상위카테고리:', data)
                상위카테고리변경(cat);
                카테고리게시글변경(data);
            })
            .catch(error => console.error("이전 채팅 fetch 오류:", error));
    }, [])


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
            .catch(error => console.error("이전 채팅 fetch 오류:", error));
    }, [하위카테고리]);


    return (
        <>
            <CategoryDropDown isActive={false}
                상위카테고리={cat.toUpperCase()} 상위카테고리변경={상위카테고리변경}
                하위카테고리={하위카테고리} 하위카테고리변경={하위카테고리변경}
            />
            <div>
                <div className="Recommend-Title">
                    {cat.toUpperCase()} {
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
                        ) : <div>로딩중입니다...</div>
                    }
                </div>
                <div className="Recommend-Gallery">
                    일단 CategoryDropDwon 상위카테고리는 박스 없애고 뒤에만 박스 넣을 것.
                    이후
                </div>
            </div>
        </>
    );
}
export default CategoryPage;