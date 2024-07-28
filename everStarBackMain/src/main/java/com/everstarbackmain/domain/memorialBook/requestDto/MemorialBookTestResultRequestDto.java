package com.everstarbackmain.domain.memorialBook.requestDto;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class MemorialBookTestResultRequestDto {

	@NotBlank
	private Integer psychologicalTestResult;

}
