package com.everstarbackmain.domain.notification.service;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.everstarbackmain.domain.notification.model.Notification;
import com.everstarbackmain.domain.notification.repository.NotificationRepository;
import com.everstarbackmain.domain.notification.requestdto.NotificationCreateRequestDto;
import com.everstarbackmain.domain.user.model.User;
import com.everstarbackmain.global.security.auth.PrincipalDetails;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j(topic = "elk")
public class NotificationService {

	private final NotificationRepository notificationRepository;

	@Transactional
	public void saveNotification(Authentication authentication, NotificationCreateRequestDto requestDto) {
		User user = ((PrincipalDetails)authentication.getPrincipal()).getUser();
		Notification notification = new Notification(user, requestDto);
		notificationRepository.save(notification);
	}
}
