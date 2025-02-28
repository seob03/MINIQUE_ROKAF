import { useState, useEffect } from 'react';
import './style/NewsList.css';
import { useParams } from 'react-router-dom';
import CardSmall from '../components/CardSmall';
import CategoryDropDown from '../components/CategoryDropDown';

function CategoryPage() {
    let [상위카테고리, 상위카테고리변경] = useState('');
    let [하위카테고리, 하위카테고리변경] = useState('');
    let {cat} = useParams();

    return (
        <>
            <CategoryDropDown isActive={false} 
            상위카테고리={cat.toUpperCase()} 상위카테고리변경={상위카테고리변경} 
            하위카테고리={하위카테고리} 하위카테고리변경={하위카테고리변경}
            />
            <div>
                <div className="Recommend-Title">
                    {cat.toUpperCase()} 카테고리를 보여줘
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