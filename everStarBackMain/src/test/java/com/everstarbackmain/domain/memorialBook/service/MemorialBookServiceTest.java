package com.everstarbackmain.domain.memorialBook.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;

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
import org.springframework.transaction.annotation.Transactional;

import com.everstarbackmain.domain.memorialBook.model.MemorialBook;
import com.everstarbackmain.domain.memorialBook.repository.MemorialBookRepository;
import com.everstarbackmain.domain.pet.model.Pet;
import com.everstarbackmain.domain.pet.requestDto.CreatePetRequestDto;
import com.everstarbackmain.domain.user.model.Gender;
import com.everstarbackmain.domain.user.model.Role;
import com.everstarbackmain.domain.user.model.User;
import com.everstarbackmain.domain.user.requestDto.JoinRequestDto;
import com.everstarbackmain.global.exception.CustomException;
import com.everstarbackmain.global.exception.ExceptionResponse;

@ExtendWith(MockitoExtension.class)
class MemorialBookServiceTest {

	@InjectMocks
	private MemorialBookService memorialBookService;

	@Mock
	private MemorialBookRepository memorialBookRepository;

	private User user;
	private Pet pet;
	private MemorialBook memorialBook;

	@BeforeEach
	public void setup() {
		user = User.signUpUser(new JoinRequestDto("email", "password", "name", "010-1111-1111",
			LocalDate.now(), Gender.MALE, LocalTime.now(), Role.ROLE_USER));
		pet = Pet.createPet(user, new CreatePetRequestDto("petName",10,
			LocalDate.of(1990, 1, 1),"species", Gender.MALE,
			"relationship", "profileImageUrl", "introduction", List.of("개구쟁이", "귀염둥이")));
		memorialBook = MemorialBook.createMemorialBook(pet);
		memorialBook.changeActiveStatus();
	}

	@Test
	@DisplayName("메모리얼북_공개_여부_수정_성공_테스트")
	@Transactional
	public void 메모리얼북_공개_여부_수정_성공_테스트() {
		// given
		BDDMockito.given(memorialBookRepository.findById(anyLong())).willReturn(Optional.of(memorialBook));

		// when
		Assertions.assertThatNoException().isThrownBy(() -> memorialBookService.changeOpenStatus(1L));

		// then
		Assertions.assertThat(memorialBook.getIsOpen()).isTrue();
	}

	@Test
	@DisplayName("메모리얼북_공개_여부_수정_비활성화_에러_테스트")
	@Transactional
	public void 메모리얼북_공개_여부_수정_비활성화_에러_테스트() {
		// given
		memorialBook.changeActiveStatus();
		BDDMockito.given(memorialBookRepository.findById(anyLong())).willReturn(Optional.of(memorialBook));

		// then
		Assertions.assertThatThrownBy(() -> memorialBookService.changeOpenStatus(1L))
			.isInstanceOf(ExceptionResponse.class)
			.hasFieldOrPropertyWithValue("customException", CustomException.NOT_ACTIVATED_MEMORIAL_BOOK_EXCEPTION);
	}

	@Test
	@DisplayName("메모리얼북_공개_여부_수정_NOT_FOUND_에러_테스트")
	@Transactional
	public void 메모리얼북_공개_여부_수정_NOT_FOUND_에러_테스트() {
		// given
		BDDMockito.given(memorialBookRepository.findById(anyLong())).willReturn(Optional.empty());

		// then
		Assertions.assertThatThrownBy(() -> memorialBookService.changeOpenStatus(1L))
			.isInstanceOf(ExceptionResponse.class)
			.hasFieldOrPropertyWithValue("customException", CustomException.NOT_FOUND_MEMORIAL_BOOK_EXCEPTION);
	}

}