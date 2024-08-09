import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InteractiveForm } from 'components/templates/InteractiveForm';
import { useFetchLetterPetDetail } from 'hooks/useEarth';

export const LetterReWriteTemplate: React.FC = () => {
  const navigate = useNavigate();

  const letterid = useParams();
  const {
    data: letterData,
    isLoading,
    isError,
  } = useFetchLetterPetDetail(Number(letterid.id));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !letterData) {
    return <div>Error loading letter data</div>;
  }

  const handleBackButtonClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  let buttonDisabled = true;
  if (letterData.data.userLetter.petName === '') {
    buttonDisabled = false;
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex items-center justify-center flex-grow'>
        <InteractiveForm
          currentPage={1}
          totalPages={1}
          onPageChange={(newPage) => console.log(`Page changed to ${newPage}`)}
          headerText='편지 자세히 보기'
          letterCardType='receive'
          letterCardColor='bgorange'
          letterCardState='received'
          letterCardMessage={letterData.data.petLetter.content}
          letterCardClassName=''
          centered={true}
          textboxLabel='내용'
          largeButtonText=''
          smallButtonText='답장하기'
          showPrimaryButton={true}
          customText=''
          petName={letterData.data.userLetter.petName}
          myName='나'
          myMessage={letterData.data.userLetter.content}
          dateTime={letterData.data.userLetter.createAt}
          onLeftIconClick={handleBackButtonClick}
          primaryButtonDisabled={buttonDisabled}
        />
      </div>
    </div>
  );
};
