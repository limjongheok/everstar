import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { EverStarMain } from 'components/templates/EverStarMain';
import { EverStarCheerMessage } from 'components/templates/EverStarCheerMessage';
import { EverStarSearchStar } from 'components/templates/EverStarSearchStar';
import { Header } from 'components/molecules/Header/Header';
import { Footer } from 'components/molecules/Footer/Footer';
import { useSelector } from 'react-redux';
import { RootState } from 'store/Store';
import bgImage from 'assets/images/bg-everstar.webp';
import { useFetchOtherPetDetails } from 'hooks/useEverStar';
import { getMemorialBooks, updateMemorialBookOpenStatus } from 'api/memorialBookApi';
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

interface MemorialBookProfile {
  id: number;
  psychologicalTestResult: string | null;
  isOpen: boolean;
  isActive: boolean;
}

export const EverstarPage: React.FC = () => {
  const params = useParams<{ pet?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPetId = useSelector((state: RootState) => state.pet.petDetails?.id);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [petProfile, setPetProfile] = useState<PetProfile | null>(null);
  const [memorialBookProfile, setMemorialBookProfile] = useState<MemorialBookProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toggleStatus, setToggleStatus] = useState<'on' | 'off' | undefined>(undefined);

  const petId = params.pet
    ? parseInt(params.pet, 10)
    : currentPetId || parseInt(sessionStorage.getItem('defaultPetId') || '0', 10);

  // Fetch pet details and memorial books when component mounts or when petId/token changes
  const { data: petDetails, isLoading: isPetDetailsLoading } = useFetchOtherPetDetails(petId!);

  useEffect(() => {
    const fetchMemorialBooks = async () => {
      try {
        if (petId && token) {
          const response = await getMemorialBooks(petId, token);
          const { id, psychologicalTestResult, isOpen, isActive } = response.data;
          setMemorialBookProfile({
            id,
            psychologicalTestResult,
            isOpen,
            isActive,
          });
          setToggleStatus(isActive ? (isOpen ? 'on' : 'off') : undefined);
        }
      } catch (error) {
        console.error('Error loading memorial books:', error);
        setLoadError('Error loading memorial books.');
        setMemorialBookProfile({
          id: 0,
          psychologicalTestResult: null,
          isOpen: false,
          isActive: false,
        });
        setToggleStatus(undefined);
      }
    };

    if (!params.pet && petId) {
      sessionStorage.setItem('defaultPetId', petId.toString());
      navigate(`/everstar/${petId}`);
    }

    if (petDetails && petDetails.data) {
      const {
        name,
        age,
        description,
        memorialDate,
        petPersonalities,
        profileImageUrl,
        questIndex,
      } = petDetails.data;
      setPetProfile({
        name,
        age,
        description,
        date: memorialDate,
        tagList: petPersonalities,
        avatarUrl: profileImageUrl,
        questIndex,
      });
    } else if (petDetails === null) {
      console.error('Pet details data is missing:', petDetails);
      setLoadError('Error loading pet details.');
    }

    fetchMemorialBooks();
    setIsLoading(isPetDetailsLoading);

    // Logic to retrieve pet details from session storage if necessary
    const storedPetDetails = sessionStorage.getItem('petDetails');
    const diffPet = sessionStorage.getItem('diffPetDetails');
    if (Number(petId) === Number(params.pet)) {
      if (storedPetDetails) {
        try {
          const petDetails = JSON.parse(storedPetDetails);
          setPetProfile({
            name: petDetails.name || 'Unknown',
            age: petDetails.age || 0,
            date: petDetails.memorialDate || 'Unknown',
            description: petDetails.introduction || 'No description',
            tagList: petDetails.petPersonalities || [],
            avatarUrl: petDetails.profileImageUrl || '',
            questIndex: petDetails.questIndex || 0,
          });
        } catch (error) {
          console.error('Error parsing pet details:', error);
        }
      }
    } else if (Number(petId) !== Number(params.pet)) {
      if (diffPet) {
        try {
          const diffPetDetails = JSON.parse(diffPet);
          setPetProfile({
            name: diffPetDetails.name || 'Unknown',
            age: diffPetDetails.age || 0,
            date: diffPetDetails.memorialDate || 'Unknown',
            description: diffPetDetails.introduction || 'No description',
            tagList: diffPetDetails.petPersonalities || [],
            avatarUrl: diffPetDetails.profileImageUrl || '',
            questIndex: diffPetDetails.questIndex || 0,
          });
        } catch (error) {
          console.error('Error parsing pet details:', error);
        }
      }
    }
  }, [location, petId, params.pet, petDetails, isPetDetailsLoading, navigate, token]);

  const handleToggle = async (status: 'off' | 'on') => {
    if (memorialBookProfile && token) {
      try {
        await updateMemorialBookOpenStatus(petId!, memorialBookProfile.id, status === 'on', token);
        setMemorialBookProfile((prev) => (prev ? { ...prev, isOpen: status === 'on' } : null));
        setToggleStatus(status);
      } catch (error) {
        console.error('Error updating memorial book status:', error);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (loadError) {
    console.error(loadError);
    return <div>Error loading data.</div>;
  }

  const buttonDisabled =
    !memorialBookProfile || !memorialBookProfile.isActive || !memorialBookProfile.isOpen;

  const isOwner = petId === currentPetId;

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
                  buttonDisabled={buttonDisabled}
                  memorialBookProfile={memorialBookProfile}
                  petId={petId ?? 0}
                  handleToggle={isOwner ? handleToggle : undefined}
                  toggleStatus={toggleStatus}
                />
              }
            />
            <Route
              path="message"
              element={
                petProfile ? (
                  <EverStarCheerMessage profile={petProfile} postItCards={[]} totalPages={0} />
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
