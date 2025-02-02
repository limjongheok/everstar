package com.everstarbackmain.domain.diary.requestDto;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class CreateDiaryRequestDto {

	@NotBlank
	private String title;

	@NotBlank
	private String content;
}
