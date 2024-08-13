import React, { useState } from 'react';
import { ProfileCard } from 'components/molecules/cards/ProfileCard/ProfileCard';
import { PostItCard } from 'components/molecules/cards/PostItCard/PostItCard';
import { PostItPlusCard } from 'components/molecules/cards/PostItPlusCard/PostItPlusCard';
import { Glass } from 'components/molecules/Glass/Glass';
import { IntroduceWrite } from 'components/organics/CheerMessage/IntroduceWrite';
import { CheerColorSelect } from 'components/organics/CheerMessage/CheerColorSelect';
import { CheerMessageWrite } from 'components/organics/CheerMessage/CheerMessageWrite';
import { useFetchCheeringPetDelete, useFetchPetPost } from 'hooks/useEverStar';
import { RootState } from 'store/Store';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export interface CheerMessageProps {
  profile: {
    name: string;
    age: number;
    date: string;
    description: string;
    tagList: string[];
    avatarUrl: string;
  };
  postItCards: Array<{
    contents: string;
    name: string;
    color: string;
    petId: number;
    cheeringMessageId: number;
  }>;
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export const CheerMessage: React.FC<CheerMessageProps> = ({
  profile,
  postItCards: initialPostItCards,
  currentPage,
  onPageChange,
}) => {
  const [postItCards, setPostItCards] = useState(initialPostItCards);
  const [isIntroduceWriteModalOpen, setIntroduceWriteModalOpen] =
    useState(false);
  const [isCheerColorSelectModalOpen, setCheerColorSelectModalOpen] =
    useState(false);
  const [isCheerMessageWriteModalOpen, setCheerMessageWriteModalOpen] =
    useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(''); // 색상 상태 추가
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const petId = useSelector((state: RootState) => state.pet.petDetails?.id);
  const petName = useSelector((state: RootState) => state.pet.petDetails?.name);
  const params = useParams(); //params.pet 사용

  const cardsPerPage = 12;
  const { mutate: createCheeringPet } = useFetchPetPost(
    token,
    Number(petId),
    Number(params.pet)
  );
  const { mutate: deleteCheeringPet } = useFetchCheeringPetDelete();

  const handleCreate = (formData: {
    content: string;
    color: string;
    isAnonymous: boolean;
    name: string;
    petId: number;
    cheeringMessageId: number;
  }) => {
    console.log(formData);
    createCheeringPet(formData, {
      onSuccess: (data) => {
        console.log(data.relationShip);
        const newPostItCard = {
          contents: formData.content,
          name: petName + ' ' + data.relationShip || '',
          color: formData.color.toLowerCase(),
          petId: Number(petId),
          cheeringMessageId: Number(data.id),
        };
        setPostItCards([...postItCards, newPostItCard]);
      },
      onError: (error) => {
        console.error('응원 메시지 생성 실패:', error);
      },
    });
  };

  const handleDelete = (
    index: number,
    petId: number,
    cheeringMessageId: number
  ) => {
    deleteCheeringPet(
      { petId, cheeringMessageId },
      {
        onSuccess: () => {
          const newPostItCards = [...postItCards];
          newPostItCards.splice(index, 1);
          setPostItCards(newPostItCards);
        },
        onError: (error) => {
          console.error('삭제 실패:', error);
        },
      }
    );
  };

  const handlePencilClick = () => {
    setIntroduceWriteModalOpen(true);
  };

  const handleCloseIntroduceWriteModal = () => {
    setIntroduceWriteModalOpen(false);
    const petIntroduce = JSON.parse(
      sessionStorage.getItem('petDetails') || '{}'
    );
    profile.description = petIntroduce.introduction;
  };

  const handleVerifyIntroduceWrite = () => {
    setIntroduceWriteModalOpen(false);
  };

  const handlePostItPlusClick = () => {
    setCheerColorSelectModalOpen(true);
  };

  const handleCloseCheerColorSelectModal = () => {
    setCheerColorSelectModalOpen(false);
  };

  const handleVerifyCheerColorSelect = () => {
    setCheerColorSelectModalOpen(false);
    setCheerMessageWriteModalOpen(true);
  };

  const handleCheerColorSelect = (color: string) => {
    switch (color) {
      case '분홍색':
        setSelectedColor('PINK');
        break;
      case '초록색':
        setSelectedColor('GREEN');
        break;
      case '파란색':
        setSelectedColor('BLUE');
        break;
      case '보라색':
        setSelectedColor('PURPLE');
        break;
      case '회색':
        setSelectedColor('GRAY');
        break;
      case '노란색':
        setSelectedColor('YELLOW');
        break;
      default:
        break;
    }
  };

  const handleCloseCheerMessageWriteModal = () => {
    setCheerMessageWriteModalOpen(false);
  };

  const handleVerifyCheerMessageWrite = (message: string) => {
    handleCreate({
      content: message,
      name: 'hi',
      color: selectedColor,
      isAnonymous: false,
      petId: 0,
      cheeringMessageId: 0,
    });
    setCheerMessageWriteModalOpen(false);
  };

  const renderPostItCards = () => {
    const startIdx = (currentPage - 1) * cardsPerPage;
    const endIdx = startIdx + cardsPerPage;
    const cardsToShow = postItCards.slice(startIdx, endIdx);
    console.log(cardsToShow);
    return cardsToShow.map((card, index) => (
      <PostItCard
        key={startIdx + index}
        contents={card.contents}
        name={card.name}
        color={card.color as never}
        onDelete={() =>
          handleDelete(startIdx + index, Number(petId), card.cheeringMessageId)
        }
      />
    ));
  };

  const totalPagesCalculated = Math.ceil(
    (postItCards.length + 1) / cardsPerPage
  ); // +1 for PostItPlusCard

  return (
    <div className='relative flex flex-col items-center p-12'>
      <div className='absolute inset-0 z-9999'>
        <Glass
          currentPage={currentPage}
          totalPages={totalPagesCalculated}
          onPageChange={onPageChange}
          showPageIndicator={true}
          className='w-full h-auto sm:w-4/5 md:w-3/5 lg:w-2/5 sm:h-4/5'
        />
      </div>
      <div className='relative w-full max-w-screen-lg p-6 rounded-lg z-9'>
        <div className='flex'>
          <div className='flex-shrink-0 mr-4'>
            <ProfileCard
              avatarSrc={profile.avatarUrl}
              name={profile.name}
              age={profile.age}
              date={profile.date}
              description={profile.description}
              tagList={profile.tagList}
              onPencilClick={handlePencilClick}
            />
          </div>
          <div className='flex-grow'>
            <div className='grid grid-cols-4 gap-4'>
              {renderPostItCards()}
              {currentPage === totalPagesCalculated && (
                <PostItPlusCard key='plus' onClick={handlePostItPlusClick} />
              )}
            </div>
          </div>
        </div>
      </div>

      <IntroduceWrite
        isOpen={isIntroduceWriteModalOpen}
        onClose={handleCloseIntroduceWriteModal}
        onVerify={handleVerifyIntroduceWrite}
        text='소개글을 입력하세요'
        onResend={() => {}}
      />

      <CheerColorSelect
        isOpen={isCheerColorSelectModalOpen}
        onClose={handleCloseCheerColorSelectModal}
        onVerify={handleVerifyCheerColorSelect}
        text='색상 정보를 선택하세요'
        onResend={function (): void {
          throw new Error('Function not implemented.');
        }}
        onOptionSelect={handleCheerColorSelect} // 색상 선택 처리 함수 전달
      />

      <CheerMessageWrite
        isOpen={isCheerMessageWriteModalOpen}
        onClose={handleCloseCheerMessageWriteModal}
        onVerify={handleVerifyCheerMessageWrite}
        text='응원 메시지를 입력하세요'
        onResend={() => {}}
      />
    </div>
  );
};
