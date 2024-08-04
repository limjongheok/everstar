package com.everstarbackmain.domain.petterLetter.responseDto.getLetterResponseDto;

import com.everstarbackmain.domain.pet.model.Pet;
import com.everstarbackmain.domain.petterLetter.model.PetLetter;
import com.everstarbackmain.domain.petterLetter.model.SendType;
import com.everstarbackmain.domain.userLetter.model.UserLetter;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
@Getter
public class GetLetterResponseDto {

	private GetUserLetterResponseDto userLetter;
	private GetPetLetterResponseDto petLetter;

	private GetLetterResponseDto(GetPetLetterResponseDto petLetter) {
		this.petLetter = petLetter;
	}

	public static GetLetterResponseDto createGetLetterResponseDto(PetLetter petLetter) {
		if(petLetter.getUserLetter() == null){
			GetPetLetterResponseDto petLetterResponseDto = GetPetLetterResponseDto.createGetPetLetterResponseDto(petLetter);
			return new GetLetterResponseDto(petLetterResponseDto);
		}
		GetUserLetterResponseDto userLetterResponseDto = GetUserLetterResponseDto.createUserLetterResponseDto(
			petLetter);
		GetPetLetterResponseDto petLetterResponseDto = GetPetLetterResponseDto.createGetPetLetterResponseDto(petLetter);
		return new GetLetterResponseDto(userLetterResponseDto, petLetterResponseDto);
	}
}
