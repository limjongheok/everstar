package com.everstarbackmain.domain.petterLetter.responseDto;

import java.time.LocalDateTime;

import com.everstarbackmain.domain.petterLetter.model.PetLetter;
import com.querydsl.core.annotations.QueryProjection;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class PetLetterResponseDto {
	private long petLetterId;
	private boolean isRead;
	private String petName;
	private String content;
	private LocalDateTime createAt;


	@QueryProjection
	public PetLetterResponseDto(Long id, Boolean isRead, String petName, String content, LocalDateTime createAt) {
		this.petLetterId = id;
		this.isRead = isRead;
		this.petName = petName;
		this.content = content;
		this.createAt = createAt;
	}

	public static PetLetterResponseDto fromPetLetter(PetLetter petLetter) {
		return PetLetterResponseDto.builder()
			.petLetterId(petLetter.getId())
			.isRead(petLetter.isRead())
			.build();
	}
}
