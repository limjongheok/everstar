import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/Store';
import { useFetchPets } from 'hooks/usePets';
import { useFetchUserInfo } from 'hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ModalHeader } from 'components/molecules/ModalHeader/ModalHeader';
import { Tab } from 'components/molecules/Tab/Tab';
import { UserInfoTab } from 'components/organics/Profile/UserInfoTab';
import { PetInfoTab } from 'components/organics/Profile/PetInfoTab';
import { Glass } from 'components/molecules/Glass/Glass';
import { useLocalPetDetails } from 'hooks/usePets';
import bgImage from 'assets/images/bg-login.webp';
import { SplashTemplate } from './SplashTemplate';

export const MyInfo: React.FC = () => {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const pets = useSelector((state: RootState) => state.pet.pets);
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const [activeTab, setActiveTab] = useState<'one' | 'two'>('one');
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);

  const {
    data: petsData,
    isLoading: isPetsLoading,
    error: petsError,
  } = useFetchPets(token);
  const { isLoading: isUserLoading, error: userError } =
    useFetchUserInfo(token);
  const { localPetDetails, refetch } = useLocalPetDetails(
    selectedPetId ?? 0,
    token
  );

  useEffect(() => {
    if (petsData && petsData.length > 0) {
      setSelectedPetId(petsData[0].id); // 첫 번째 펫을 기본으로 선택
    }
  }, [petsData]);

  useEffect(() => {
    if (selectedPetId !== null) {
      refetch();
    }
  }, [selectedPetId, refetch]);

  const getGenderText = useCallback((gender: string) => {
    switch (gender) {
      case 'MALE':
        return '남성';
      case 'FEMALE':
        return '여성';
      default:
        return 'unknown';
    }
  }, []);

  const petOptions = useMemo(() => pets.map((pet) => pet.name), [pets]);

  const petInfo = useMemo(() => {
    if (!localPetDetails) return {};
    return {
      [localPetDetails.name]: {
        id: localPetDetails.id,
        userId: localPetDetails.userId,
        name: localPetDetails.name,
        age: localPetDetails.age,
        memorialDate: localPetDetails.memorialDate || 'unknown',
        gender: getGenderText(localPetDetails.gender) || 'unknown',
        species: localPetDetails.species || 'unknown',
        relationship: localPetDetails.relationship,
        personalities: localPetDetails.personalities || [],
        profileImageUrl: localPetDetails.profileImageUrl,
      },
    };
  }, [localPetDetails, getGenderText]);

  const onPetSelect = useCallback(
    (name: string) => {
      const selectedPet = pets.find((pet) => pet.name === name);
      if (selectedPet && selectedPet.id !== selectedPetId) {
        setSelectedPetId(selectedPet.id);
        setActiveTab('two'); // 반려동물을 선택하면 탭을 전환
      }
    },
    [pets, selectedPetId]
  );

  if (isPetsLoading || isUserLoading) {
    return (
      <div className='relative flex flex-col items-center justify-center min-h-screen bg-center bg-cover z-[-1]'>
        <img
          src={bgImage}
          alt='Background'
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <SplashTemplate type='myPageRocket' className='z-10 w-full h-full ' />
      </div>
    );
  }

  if (petsError) return <div className='text-red-500'>{petsError.message}</div>;
  if (userError) return <div className='text-red-500'>{userError.message}</div>;

  const handleButtonClick = () => {
    sessionStorage.removeItem('persist:root');
    sessionStorage.removeItem('petDetails');
    sessionStorage.removeItem('diffPetDetails');
    window.location.reload();
  };

  return (
    <div className='relative flex flex-col items-center justify-start w-full min-h-screen-56'>
      <Glass
        currentPage={1}
        totalPages={1}
        onPageChange={(newPage) => console.log('Page changed to:', newPage)}
        showPageIndicator={false}
        className='absolute top-0 bottom-0 left-0 right-0 z-0'
      />
      <div className='relative z-10 flex flex-col items-center justify-center w-full h-full'>
        <div className='flex justify-center w-full'>
          {/* 수평 중앙 정렬을 위해 justify-center 적용 */}
          <div className='flex flex-col items-center min-w-[360px] max-w-md w-full gap-8 p-5 bg-white rounded-lg shadow-md'>
            <ModalHeader
              text='마이 페이지'
              showLeftIcon={true}
              onLeftIconClick={() => navigate(-1)}
            />
            <Tab
              row='two'
              activeTab={activeTab}
              className='mb-4'
              onTabClick={(tab) => setActiveTab(tab as 'one' | 'two')}
            />
            <div className='flex flex-col items-center justify-start w-full gap-4 pb-12'>
              {activeTab === 'one' ? (
                <UserInfoTab
                  userInfo={{
                    name: userInfo?.userName || '',
                    birthdate: userInfo?.birthDate || '',
                    gender: getGenderText(userInfo?.gender || ''),
                    email: userInfo?.email || '',
                    phone: userInfo?.phoneNumber || '',
                  }}
                  smallButtonText='핸드폰 번호 수정하기'
                  onButtonClick={handleButtonClick}
                />
              ) : (
                <PetInfoTab
                  petOptions={petOptions}
                  petInfo={petInfo}
                  onPetSelect={onPetSelect}
                  token={token}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
