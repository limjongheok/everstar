import React, { SetStateAction, useEffect, useState } from 'react';
import { InteractiveForm } from 'components/templates/InteractiveForm';
import { Glass } from 'components/molecules/Glass/Glass';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from 'store/Store';
import { useNavigate } from 'react-router-dom';
import { Dispatch } from 'redux';
import { Puzzle } from './Puzzle';

 const QuestPuzzle: React.FC = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [questContent, setQuestContent] = useState('');
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const { questid } = useParams<{ questid: string }>();
  const petId = useSelector((state: RootState) => state.pet.petDetails?.id);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    getQuest();
  }, []);

  const getQuest = async () => {
    try {
      const response = await axios.get(
        `https://i11b101.p.ssafy.io/api/pets/${petId}/quests/${questid}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data) {
        console.log('성공:', response.data.data.content);
        setQuestContent(response.data.data.content);
      }
    } catch (error) {
      console.error('퀘스트 데이터를 가져오는 중 오류 발생:', error);
    } finally {
      setLoading(false); // 데이터 로딩 후 로딩 상태 업데이트
    }
  };

  const answerQuestion = async () => {
    const formData = new FormData();
    const requestDto = JSON.stringify({ content: text, type: 'TEXT' });

    const requestDtoBlob = new Blob([requestDto], {
      type: 'application/json',
    });
    formData.append('requestDto', requestDtoBlob);

    try {
      const response = await axios.post(
        `https://i11b101.p.ssafy.io/api/pets/${petId}/quests/${questid}/answers`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log('Response:', response.data);

      return response.status;
    } catch (error) {
      console.error('답변 전송 중 오류 발생:', error);
    }
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    console.log('입력된 텍스트:', text);
  };

  const handleSubmit = async () => {
    const status = await answerQuestion();

    if (status === 200) {
      console.log('성공');
      navigate('/earth');
    } else {
      console.log('실패');
    }
  };

  // 로딩 중이거나 퀘스트 데이터가 없으면 로딩 스피너 또는 빈 화면을 보여

  const [pieceSize, setPieceSize] = useState(100);
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(850);


  return (
    <div className='relative items-center justify-center min-h-screen fle'>
      
           <Puzzle id="puzzle" pieceSize={pieceSize} width={width} height={height} />

    </div>
  );
};

export default QuestPuzzle;
