// src/api/petApi.ts
import config from 'config';

export interface Pet {
  id: number;
  profileImageUrl: string;
  name: string;
}

export interface PetFormData {
  name: string;
  age: number;
  memorialDate: string | null;
  species: string;
  gender: string;
  relationship: string;
  profileImage: File | null;
  personalities: string[];
}

export interface PetInfo {
  id: number;
  userId: number;
  name: string;
  age: number;
  memorialDate: string; // LocalDate 형식으로 유지
  species: string;
  gender: string;
  relationship: string;
  profileImageUrl: string;
  personalities: string[];
}

interface ApiResponse {
  data: Pet[];
}

export const fetchPets = async (token: string): Promise<Pet[]> => {
  console.log('Fetching pets with token:', token);
  const response = await fetch(`${config.API_BASE_URL}/api/pets`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log('Response status:', response.status);
  if (!response.ok) {
    throw new Error('반려동물 정보를 가져오는 데 실패했습니다');
  }

  const result: ApiResponse = await response.json();
  console.log('Fetched pets:', result);
  return result.data;
};

export const fetchPetDetails = async (petId: number, token: string): Promise<PetInfo> => {
  console.log(`Fetching pet details for petId ${petId} with token:`, token);
  const response = await fetch(`${config.API_BASE_URL}/api/pets/${petId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log('Response status:', response.status);
  if (!response.ok) {
    throw new Error('반려동물 상세 정보를 가져오는 데 실패했습니다');
  }

  const result = await response.json();
  console.log('Fetched pet details:', result);

  // Transform the data to fit the PetInfo interface
  const petDetails: PetInfo = {
    id: result.data.id,
    userId: result.data.userId,
    name: result.data.name,
    age: result.data.age,
    memorialDate: result.data.memorialDate,
    species: result.data.species,
    gender: result.data.gender,
    relationship: result.data.relationship,
    profileImageUrl: result.data.profileImageUrl,
    personalities: result.data.petPersonalities, // Convert petPersonalities to personalities
  };

  return petDetails;
};

export const addPet = async (formData: FormData, token: string) => {
  console.log('Adding pet with token:', token);
  const response = await fetch(`${config.API_BASE_URL}/api/pets`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  console.log('Response status:', response.status);
  if (!response.ok) {
    throw new Error('반려동물을 추가하는 데 실패했습니다');
  }

  const data = await response.json();
  console.log('Added pet response:', data);
  return data;
};
