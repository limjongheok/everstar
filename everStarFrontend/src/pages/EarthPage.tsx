import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { EarthMain } from 'components/templates/EarthMain';
import { LetterBoxTemplate } from 'components/templates/LetterBoxTemplate';
import { Header } from 'components/molecules/Header/Header';
import { Footer } from 'components/molecules/Footer/Footer';
import {
  LetterColor,
  LetterState,
} from 'components/molecules/cards/LetterCard/LetterCard';
import { LetterDetailTemplate } from 'components/templates/LetterDetailTemplate';
import { LetterWriteTemplate } from 'components/templates/LetterWriteTemplate';
import { LetterReWriteTemplate } from 'components/templates/LetterReWriteTemplate';
import { QuestTemplate } from 'components/templates/QuestTemplate';
import { QuestOpenviduTemplate } from 'components/templates/QuestOpenviduTemplate';
import { OpenViduAppWrapper } from 'components/templates/openvidu/OpenViduApp';
import bgImage from 'assets/images/bg-earth.webp';

export const EarthPage: React.FC = () => {
  const generateLargeLetterData = (count: number) => {
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      type: 'default' as const,
      color: (index % 2 === 0 ? 'white' : 'bgorange') as LetterColor,
      state: (index % 2 === 0 ? 'notReceived' : 'received') as LetterState,
      name: `Sender ${index + 1}`,
      sendMessage: `Message content ${index + 1}`,
      dateTime: `2024-08-${(index % 31) + 1}`,
    }));
  };
  return (
    <div
      className='relative flex flex-col w-full min-h-screen bg-center bg-cover'
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Header type='earth' className='top-0 z-50' />
      <div className='flex flex-col flex-grow'>
        <div className='flex-grow'>
          <Routes>
            <Route
              path='/'
              element={
                <EarthMain
                  title='지구별'
                  fill={7}
                  buttonSize='large'
                  buttonDisabled={false}
                  buttonText='영원별로 이동'
                  buttonIcon='SmallStarImg'
                  onButtonClick={() => console.log('영원별 이동')}
                />
              }
            />
            <Route
              path='letterbox'
              element={
                <LetterBoxTemplate
                  letterData={generateLargeLetterData(50)}
                  currentPage={1}
                  totalPages={9}
                  onPageChange={() => console.log('이동1')}
                  headerText='편지함'
                />
              }
            />
            <Route path='letter' element={<LetterWriteTemplate />} />
            <Route path='letter/:id' element={<LetterDetailTemplate />} />
            <Route path='letter/post/:id' element={<LetterReWriteTemplate />} />
            <Route
              path='quest/:questid'
              element={
                <QuestTemplate
                  letterCardColor='white'
                  letterCardType='default'
                  headerText={'오늘의 질문'}
                  letterCardMessage='Q. 뚜뚜와 놀았던 이야기를 해주세요'
                  textboxLabel={'내용'}
                  showPrimaryButton={false}
                  largeButtonText={'이미지 추가'}
                  smallButtonText={'작성완료'}
                />
              }
            />
            <Route
              path='openvidu'
              element={
                <QuestOpenviduTemplate
                  headerText='오늘의 질문'
                  textboxLabel='내용'
                  largeButtonText='이미지 삽입'
                  smallButtonText='제출'
                />
              }
            />
            <Route
              path='openvidu/sessionid/:sessionId'
              element={<OpenViduAppWrapper />}
            />
            <Route path='openvidu/sessionid' element={<OpenViduAppWrapper />} />
          </Routes>
        </div>
        <Footer className='w-full mt-auto' />
      </div>
    </div>
  );
};
