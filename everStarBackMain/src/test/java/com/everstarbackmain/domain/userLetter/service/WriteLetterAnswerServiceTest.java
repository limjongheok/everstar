package com.everstarbackmain.domain.userLetter.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.BDDMockito;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import com.everstarbackmain.domain.pet.model.Pet;
import com.everstarbackmain.domain.pet.model.PetGender;
import com.everstarbackmain.domain.pet.repository.PetRepository;
import com.everstarbackmain.domain.pet.requestDto.CreatePetRequestDto;
import com.everstarbackmain.domain.petterLetter.model.PetLetter;
import com.everstarbackmain.domain.petterLetter.repository.PetLetterRepository;
import com.everstarbackmain.domain.user.model.Gender;
import com.everstarbackmain.domain.user.model.Role;
import com.everstarbackmain.domain.user.model.User;
import com.everstarbackmain.domain.user.requestDto.JoinRequestDto;
import com.everstarbackmain.domain.userLetter.repository.UserLetterRepository;
import com.everstarbackmain.domain.userLetter.requestDto.WriteLetterRequestDto;
import com.everstarbackmain.global.security.auth.PrincipalDetails;

@ExtendWith(MockitoExtension.class)
public class WriteLetterAnswerServiceTest {

	@InjectMocks
	private UserLetterService userLetterService;

	@Mock
	private UserLetterRepository userLetterRepository;

	@Mock
	private PetRepository petRepository;

	@Mock
	private PetLetterRepository petLetterRepository;

	@Mock
	private Authentication authentication;

	@Mock
	private PrincipalDetails principalDetails;

	private User user;
	private Pet pet;
	private PetLetter petLetter;
	private WriteLetterRequestDto requestDto;

	@BeforeEach
	public void setUp() {
		user = User.signUpUser(new JoinRequestDto("email", "password", "name", "010-1111-1111",
			LocalDate.now(), Gender.MALE, LocalTime.now(), Role.ROLE_USER));

		pet = Pet.createPet(user, new CreatePetRequestDto("petName", 10,
			LocalDate.of(1990, 1, 1), "species", PetGender.MALE,
			"relationship", "profileImageUrl", List.of("개구쟁이", "귀염둥이")));

		petLetter = PetLetter.writePetLetter(pet,"content");
		requestDto = new WriteLetterRequestDto("dd", "dd");
	}

	@Test
	@DisplayName("펫이 보낸 편지에 답장쓰기 성공 테스트")
	public void 펫이_보낸_편지_답장_쓰기_성공_테스트() {

		//given
		BDDMockito.given(authentication.getPrincipal()).willReturn(principalDetails);
		BDDMockito.given(principalDetails.getUser()).willReturn(user);
		BDDMockito.given(petRepository.findByIdAndUserAndIsDeleted(1L, user, false)).willReturn(Optional.of(pet));
		BDDMockito.given(petLetterRepository.findPetLetterByIdAndPetAndIsDeleted(1L, pet, false))
			.willReturn(Optional.of(petLetter));

		// when then
		Assertions.assertThatNoException()
			.isThrownBy(() -> userLetterService.writeLetterAnswer(authentication, 1L, 1L, requestDto));
	}
}
