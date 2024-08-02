package com.everstarbackmain.domain.petLetter.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.BDDMockito;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.everstarbackmain.domain.openai.util.OpenAiClient;
import com.everstarbackmain.domain.pet.model.Pet;
import com.everstarbackmain.domain.pet.repository.PetRepository;
import com.everstarbackmain.domain.pet.requestDto.CreatePetRequestDto;
import com.everstarbackmain.domain.petterLetter.repository.PetLetterRepository;
import com.everstarbackmain.domain.petterLetter.service.PetLetterService;
import com.everstarbackmain.domain.user.model.Gender;
import com.everstarbackmain.domain.user.model.Role;
import com.everstarbackmain.domain.user.model.User;
import com.everstarbackmain.domain.user.requestDto.JoinRequestDto;
import com.everstarbackmain.domain.userLetter.model.UserLetter;
import com.everstarbackmain.domain.userLetter.requestDto.WriteLetterRequestDto;
import com.everstarbackmain.global.sms.SmsCertificationUtil;

@ExtendWith(MockitoExtension.class)
public class WritePetLetterAnswerService {

	@InjectMocks
	private PetLetterService petLetterService;

	@Mock
	private PetLetterRepository petLetterRepository;

	@Mock
	private PetRepository petRepository;

	@Mock
	private OpenAiClient openAiClient;

	@Mock
	private SmsCertificationUtil smsCertificationUtil;

	private User user;
	private Pet pet;
	private WriteLetterRequestDto requestDto;
	private UserLetter userLetter;

	@BeforeEach
	public void setUp() {
		user = User.signUpUser(new JoinRequestDto("email", "password", "name", "010-1111-1111",
			LocalDate.now(), Gender.MALE, LocalTime.now(), Role.ROLE_USER));

		pet = Pet.createPet(user, new CreatePetRequestDto("petName", 10,
			LocalDate.of(1990, 1, 1), "species", Gender.MALE,
			"relationship", "profileImageUrl", List.of("개구쟁이", "귀염둥이")));
		requestDto = new WriteLetterRequestDto("dd", "dd");
		userLetter = UserLetter.writeLetterHasImage(pet, requestDto);
		userLetter = UserLetter.writeLetterHasNotImage(pet, requestDto);
	}

	@Test
	@DisplayName("애완동물_편지_답장_성공_테스트")
	public void 애완동물_편지_답장_성공_테스트(){
		BDDMockito.given(openAiClient.writePetLetter(userLetter)).willReturn("content");

		Assertions.assertThatNoException()
			.isThrownBy(() -> petLetterService.writePetLetterAnswer(userLetter));
	}
}
