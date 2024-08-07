import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { EverStarMain } from 'components/templates/EverStarMain';
import { EverStarCheerMessage } from 'components/templates/EverStarCheerMessage';
import { EverStarSearchStar } from 'components/templates/EverStarSearchStar';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'store/Store';

interface PetProfile {
  name: string;
  age: number;
  date: string;
  description: string;
  tagList: string[];
  avatarUrl: string;
}

export const EverstarPage: React.FC = () => {
  const params = useParams();
  const [petProfile, setPetProfile] = useState<PetProfile | null>(null);
  const location = useLocation(); // Use location to trigger re-render
  const petId = useSelector((state: RootState) => state.pet.petDetails?.id);
  useEffect(() => {
    const storedPetDetails = sessionStorage.getItem('petDetails');
    const diffPet = sessionStorage.getItem('diffPetDetails');
    if (Number(petId) === Number(params.pet)) {
      if (storedPetDetails) {
        try {
          // Parse the stored JSON string and update the state
          const petDetails = JSON.parse(storedPetDetails);
          setPetProfile({
            name: petDetails.name || 'Unknown',
            age: petDetails.age || 0,
            date: petDetails.memorialDate || 'Unknown',
            description: petDetails.introduction || 'No description',
            tagList: petDetails.petPersonalities || [],
            avatarUrl: petDetails.profileImageUrl || '',
          });
        } catch (error) {
          console.error('Error parsing pet details:', error);
        }
      }
    } else if (Number(petId) !== Number(params.pet)) {
      if (diffPet) {
        try {
          // Parse the stored JSON string and update the state
          const diffPetDetails = JSON.parse(diffPet);
          console.log(diffPetDetails);
          setPetProfile({
            name: diffPetDetails.name || 'Unknown',
            age: diffPetDetails.age || 0,
            date: diffPetDetails.memorialDate || 'Unknown',
            description: diffPetDetails.introduction || 'No description',
            tagList: diffPetDetails.petPersonalities || [],
            avatarUrl: diffPetDetails.profileImageUrl || '',
          });
        } catch (error) {
          console.error('Error parsing pet details:', error);
        }
      }
    }
  }, [location]);

  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex-grow'>
        <Routes>
          <Route
            path='/'
            element={
              <EverStarMain
                title='a'
                fill={49}
                buttonSize='large'
                buttonDisabled={false}
                buttonText='지구별로 이동'
                onButtonClick={() => console.log('영원별 이동')}
                buttonTheme={'white'}
              />
            }
          />
          <Route
            path='message'
            element={
              petProfile ? (
                <EverStarCheerMessage
                  profile={petProfile}
                  postItCards={[]} // Add actual data if available
                  totalPages={0} // Add actual data if available
                />
              ) : (
                <div>Loading...</div> // Or any fallback UI
              )
            }
          />

          <Route path='explore' element={<EverStarSearchStar />} />
        </Routes>
      </div>
    </div>
  );
};
