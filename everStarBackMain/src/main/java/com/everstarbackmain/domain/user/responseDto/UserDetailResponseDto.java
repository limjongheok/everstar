package com.everstarbackmain.domain.user.responseDto;

import java.time.LocalDate;
import java.time.LocalTime;
import com.everstarbackmain.domain.user.model.Gender;
import com.everstarbackmain.domain.user.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Builder
@Getter
public class UserDetailResponseDto {

	private String email;
	private String userName;
	private String phoneNumber;
	private LocalDate birthDate;
	private Gender gender;
	private LocalTime questReceptionTime;

	public static UserDetailResponseDto createUserDetailResponseDto(User user) {
		return UserDetailResponseDto.builder()
			.email(user.getEmail())
			.userName(user.getUserName())
			.phoneNumber(user.getPhoneNumber())
			.birthDate(user.getBirthDate())
			.gender(user.getGender())
			.questReceptionTime(user.getQuestReceptionTime())
			.build();
	}
}
