package com.everstarbackauth.domain.user.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

import com.everstarbackauth.domain.user.requestDto.JoinRequestDto;
import com.everstarbackauth.global.exception.CustomException;
import com.everstarbackauth.global.exception.ExceptionResponse;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id", nullable = false)
	private int id;

	@Column(name = "email", nullable = false, unique = true)
	private String email;

	@Column(name = "password", nullable = false)
	private String password;

	@Column(name = "user_name", nullable = false)
	private String userName;

	@Column(name = "phone_number", nullable = false, unique = true)
	private String phoneNumber;

	@Column(name = "birth_date", nullable = false)
	private LocalDate birthDate;

	@Column(name = "gender", nullable = false)
	@Enumerated(EnumType.STRING)
	private Gender gender;

	@Column(name = "quest_reception_time")
	private LocalTime questReceptionTime;

	@Column(name = "role", nullable = false)
	@Enumerated(EnumType.STRING)
	private Role role;

	@Column(name = "is_deleted", nullable = false)
	private boolean isDeleted;

	@Builder
	private User(String email, String password, String userName, String phoneNumber, LocalDate birthDate, Gender gender,
		LocalTime questReceptionTime, Role role) {
		this.email = email;
		this.password = password;
		this.userName = userName;
		this.phoneNumber = phoneNumber;
		this.birthDate = birthDate;
		this.gender = gender;
		this.questReceptionTime = questReceptionTime;
		this.role = role;
		this.isDeleted = false;
	}

	public static User signUpUser(JoinRequestDto joinRequestDto) {
		return User.builder()
			.email(joinRequestDto.getEmail())
			.password(joinRequestDto.getPassword())
			.userName(joinRequestDto.getUserName())
			.phoneNumber(joinRequestDto.getPhoneNumber())
			.birthDate(joinRequestDto.getBirthDate())
			.gender(joinRequestDto.getGender())
			.questReceptionTime(joinRequestDto.getQuestReceptionTime())
			.role(joinRequestDto.getRole())
			.build();
	}

	public static User oAuthSignUpUser(String email, String userName){
		return User.builder()
			.email(email)
			.password("test")
			.userName(userName)
			.phoneNumber("test")
			.birthDate(LocalDate.now())
			.gender(Gender.MALE)
			.role(Role.ROLE_USER)
			.build();

	}

	public List<Role> getMemberRoles() {
		if (this.role != null) {
			return Arrays.asList(this.role);
		}
		throw new ExceptionResponse(CustomException.NOT_EMPTY_ROLE_EXCEPTION);
	}
}
