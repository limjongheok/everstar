package com.everstarbackmain.domain.petLetter.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Collections;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;

import com.everstarbackmain.domain.pet.model.Pet;
import com.everstarbackmain.domain.pet.model.PetGender;
import com.everstarbackmain.domain.pet.repository.PetRepository;
import com.everstarbackmain.domain.pet.requestdto.CreatePetRequestDto;
import com.everstarbackmain.domain.petterLetter.repository.PetLetterRepository;
import com.everstarbackmain.domain.petterLetter.responsedto.PetLetterResponseDto;
import com.everstarbackmain.domain.petterLetter.service.PetLetterService;
import com.everstarbackmain.domain.user.model.Gender;
import com.everstarbackmain.domain.user.model.Role;
import com.everstarbackmain.domain.user.model.User;
import com.everstarbackmain.domain.user.requestDto.JoinRequestDto;
import com.everstarbackmain.domain.userLetter.model.UserLetter;
import com.everstarbackmain.domain.userLetter.requestDto.WriteLetterRequestDto;
import com.everstarbackmain.global.exception.CustomException;
import com.everstarbackmain.global.exception.ExceptionResponse;
import com.everstarbackmain.global.openai.util.OpenAiClient;
import com.everstarbackmain.global.security.auth.PrincipalDetails;
import com.everstarbackmain.global.sms.SmsCertificationUtil;

@ExtendWith(MockitoExtension.class)
public class GetPetLetterServiceTest {

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

	@Mock
	private Authentication authentication;

	@Mock
	private PrincipalDetails principalDetails;

	@Mock
	private Pageable pageable;

	private User user;
	private Pet pet;
	private WriteLetterRequestDto requestDto;
	private UserLetter userLetter;

	@BeforeEach
	public void setUp() {
		user = User.signUpUser(new JoinRequestDto("email", "password", "name", "010-1111-1111",
			LocalDate.now(), Gender.MALE, LocalTime.now(), Role.ROLE_USER));

		pet = Pet.createPet(user, new CreatePetRequestDto("petName", 10,
			LocalDate.of(1990, 1, 1), "species", PetGender.MALE,
			"relationship", List.of("개구쟁이", "귀염둥이")), "profileImageUrl");
		requestDto = new WriteLetterRequestDto("dd");
		userLetter = UserLetter.writeLetterHasImage(pet, "filteredContent", "image");
		userLetter = UserLetter.writeLetterHasNotImage(pet, "filteredContent");
	}

	@Test
	@DisplayName("펫이 보낸 편지 보기 성공 테스트")
	public void 펫이_보낸_편지_보기_성공_테스트() {
		// given
		BDDMockito.given(authentication.getPrincipal()).willReturn(principalDetails);
		BDDMockito.given(principalDetails.getUser()).willReturn(user);
		BDDMockito.given(petRepository.existsByIdAndUserAndIsDeleted(1L, user, false)).willReturn(true);

		Page<PetLetterResponseDto> expectedPage = new PageImpl<>(
			Collections.singletonList(new PetLetterResponseDto(1L, false, "test", "test", LocalDateTime.now()))
		);
		BDDMockito.given(petLetterRepository.findPetLettersByPetId(user, 1L, pageable))
			.willReturn(expectedPage);

		// when
		Page<PetLetterResponseDto> actualPage = petLetterService.getPetLetters(authentication, 1L, pageable);

		// then
		Assertions.assertThat(actualPage).isEqualTo(expectedPage);
	}

	@Test
	@DisplayName("펫이 보낸 편지 보기 실패 펫 존재하지 않음 테스트")
	public void 펫이_보낸_편지_보기_펫_존재하지_않음_실패_테스트() {
		// given
		BDDMockito.given(authentication.getPrincipal()).willReturn(principalDetails);
		BDDMockito.given(principalDetails.getUser()).willReturn(user);
		// Pet ID는 1L로 설정하여 존재하지 않는 펫을 테스트
		BDDMockito.given(petRepository.existsByIdAndUserAndIsDeleted(1L, user, false)).willReturn(false);

		// when & then
		Assertions.assertThatThrownBy(() -> petLetterService.getPetLetters(authentication, 1L, pageable))
			.isInstanceOf(ExceptionResponse.class)
			.hasFieldOrPropertyWithValue("customException", CustomException.NOT_FOUND_PET_EXCEPTION);
	}
}
