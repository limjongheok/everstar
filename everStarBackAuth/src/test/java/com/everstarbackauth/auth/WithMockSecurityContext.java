package com.everstarbackauth.auth;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextFactory;

import com.everstarbackauth.domain.user.model.Gender;
import com.everstarbackauth.domain.user.model.Role;
import com.everstarbackauth.domain.user.model.User;
import com.everstarbackauth.domain.user.requestDto.JoinRequestDto;
import com.everstarbackauth.global.security.auth.PrincipalDetails;

public class WithMockSecurityContext implements WithSecurityContextFactory<WithMockAuthUser> {

	@Override
	public SecurityContext createSecurityContext(WithMockAuthUser mockUser) {
		SecurityContext context = SecurityContextHolder.createEmptyContext();
		User user = User.signUpUser(new JoinRequestDto("email", "password", "name", "010-1111-1111", LocalDate.now(),
			Gender.MALE, LocalTime.now(), Role.ROLE_USER));
		PrincipalDetails memberDetails = new PrincipalDetails(user);
		Authentication authentication = new UsernamePasswordAuthenticationToken(memberDetails,null,memberDetails.getAuthorities());
		context.setAuthentication(authentication);
		return context;
	}
}