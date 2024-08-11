import React, { useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { EverStarMain } from 'components/templates/EverStarMain';
import { EverStarCheerMessage } from 'components/templates/EverStarCheerMessage';
import { EverStarSearchStar } from 'components/templates/EverStarSearchStar';
import { Header } from 'components/molecules/Header/Header';
import { Footer } from 'components/molecules/Footer/Footer';
import { useSelector } from 'react-redux';
import { RootState } from 'store/Store';
import bgImage from 'assets/images/bg-everstar.webp';
import { useFetchOtherPetDetails, useFetchCheeringPet } from 'hooks/useEverStar';
import { useFetchMemorialBooks } from 'hooks/useMemorialBooks';
import { MemorialBook } from 'components/templates/MemorialBook';

interface PetProfile {
  name: string;
  age: number;
  description: string;
  date: string;
  tagList: string[];
  avatarUrl: string;
  questIndex: number;
}

export const EverstarPage: React.FC = () => {
  const params = useParams<{ pet?: string }>();
  const navigate = useNavigate();
  const currentPetId = useSelector((state: RootState) => state.pet.petDetails?.id);

  const petId = useMemo(
    () =>
      params.pet
        ? parseInt(params.pet, 10)
        : currentPetId || parseInt(sessionStorage.getItem('defaultPetId') || '0', 10),
    [params.pet, currentPetId],
  );

  const { data: petDetails, isLoading: isPetDetailsLoading } = useFetchOtherPetDetails(petId);
  const { data: memorialBooks, isLoading: isMemorialBooksLoading } = useFetchMemorialBooks(petId);
  const { data: cheerData, isLoading: isCheerLoading } = useFetchCheeringPet();

  useEffect(() => {
    if (!params.pet && petId && !sessionStorage.getItem('initialNavigation')) {
      sessionStorage.setItem('defaultPetId', petId.toString());
      sessionStorage.setItem('initialNavigation', 'true');
      navigate(`/everstar/${petId}`);
    }
  }, [params.pet, petId, navigate]);

  if (isPetDetailsLoading || isMemorialBooksLoading || isCheerLoading) {
    return <div>Loading...</div>;
  }

  if (!petDetails || !memorialBooks) {
    return <div>Error loading data.</div>;
  }

  const petProfile: PetProfile = {
    name: petDetails.name,
    age: petDetails.age,
    description: petDetails.introduction,
    date: petDetails.memorialDate,
    tagList: petDetails.petPersonalities,
    avatarUrl: petDetails.profileImageUrl,
    questIndex: petDetails.questIndex,
  };

  const postItCards =
    cheerData?.data?.content?.map(
      (item: {
        content: string;
        petName: string;
        color: string;
        cheeringMessageId: number;
        petId: number;
      }) => ({
        contents: item.content || '',
        name: item.petName || '',
        color: item.color.toLowerCase() || '',
        cheeringMessageId: item.cheeringMessageId,
        petId: item.petId,
      }),
    ) || [];

  const totalPages = Math.ceil(postItCards.length / 10);

  return (
    <div
      className="flex flex-col min-h-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="flex flex-col min-h-screen">
        <Header type="everstar" className="top-0 z-50" />
        <div className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <EverStarMain
                  petProfile={petProfile}
                  buttonDisabled={!memorialBooks.data.isActive || !memorialBooks.data.isOpen}
                  memorialBookProfile={memorialBooks.data}
                  petId={petId ?? 0}
                />
              }
            />
            <Route
              path="message"
              element={
                petProfile ? (
                  <EverStarCheerMessage
                    profile={petProfile}
                    postItCards={postItCards}
                    totalPages={totalPages}
                  />
                ) : (
                  <div>Loading...</div>
                )
              }
            />
            <Route path="explore" element={<EverStarSearchStar />} />
            <Route
              path="memorialbook/:memorialBookId"
              element={
                petProfile ? (
                  <MemorialBook avatarUrl={petProfile.avatarUrl} />
                ) : (
                  <div>Loading...</div>
                )
              }
            />
          </Routes>
        </div>
        <Footer className="mt-auto" />
      </div>
    </div>
  );
};
