/* eslint-disable @typescript-eslint/no-unused-expressions */

import React, { useState, useEffect } from 'react';
import { InteractiveForm } from 'components/templates/InteractiveForm';
import { Glass } from 'components/molecules/Glass/Glass';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from 'store/Store';
import { useNavigate } from 'react-router-dom';

export const QuestWithImageTemplate = () => {
  // headerText와 letterCardMessage를 오버라이드
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>();
  const [questContent, setQuestContent] = useState('');
  const [loading, setLoading] = useState(true);

  const { questid } = useParams<{ questid: string }>();
  const petId = useSelector((state: RootState) => state.pet.petDetails?.id);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    getQuest();
    console.log('이미지!!!!: ', image);
  }, [image]);

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


  const answerImageQuestion = async () => {
    if (text && accessToken && petId && image) {
      // FormData 객체 생성
      const formData = new FormData();

      // JSON 데이터 준비
      const requestDto = JSON.stringify({ content: text, type: 'TEXT_IMAGE' });

      const requestDtoBlob = new Blob([requestDto], {
        type: 'application/json',
      });
      // JSON 데이터를 FormData에 추가
      formData.append('requestDto', requestDtoBlob);

      if (image) {
        formData.append('imageFile', image);
        console.log('이미지 잘 들어갔니?');
      } else {
        const emptyFile = new File([new Blob()], '', { type: 'image/jpeg' });
        formData.append('image', emptyFile);
      }

      try {
        // POST 요청을 FormData와 함께 전송
        const response = await axios.post(
          `http://localhost:8081/api/pets/${petId}/quests/${questid}/answers`,
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
        console.error('Error:', error);
      }
    } else {
      console.error('Required data is missing');
    }
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    console.log('입력된 텍스트: ', text);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
  };

  const handleSubmit = async () => {
    const status = await answerImageQuestion();

    if (status === 200) {
      console.log('성공');
      navigate('/earth');
    } else {
      console.log('실패');
    }
  };

  const handleButtonClick2 = async () => {
    document.getElementById('photoInput')?.click();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='relative flex items-center justify-center min-h-screen'>
      <Glass
        currentPage={1}
        totalPages={1}
        onPageChange={() => console.log('이동')}
        showPageIndicator={false}
        className='w-full h-auto sm:w-4/5 md:w-3/5 lg:w-2/5 sm:h-4/5'
      />
      <div className='absolute inset-0 flex items-center justify-center'>
        <InteractiveForm
          currentPage={1}
          totalPages={1}
          onPageChange={(newPage) => console.log('Page changed to:', newPage)}
          headerText='오늘의 질문'
          letterCardType='send'
          letterCardColor='white'
          letterCardState='notReceived'
          letterCardMessage={questContent}
          centered={true}
          textboxLabel='답변'
          largeButtonText='이미지 추가'
          smallButtonText='작성완료'
          showPrimaryButton={true}
          onTextChange={handleTextChange}
          value={text}
          onButtonClick={handleSubmit}
          onButtonClick2={handleButtonClick2}
        />
        <input
          type='file'
          id='photoInput'
          accept='image/*'
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};
0;
