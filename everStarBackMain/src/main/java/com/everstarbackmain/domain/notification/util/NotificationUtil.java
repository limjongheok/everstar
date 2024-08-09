package com.everstarbackmain.domain.notification.util;

import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.everstarbackmain.domain.notification.model.Notification;
import com.everstarbackmain.domain.notification.repository.NotificationRepository;
import com.everstarbackmain.domain.user.model.User;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.WebpushConfig;
import com.google.firebase.messaging.WebpushNotification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j(topic = "elk")
public class NotificationUtil {

	private final NotificationRepository notificationRepository;

	@Transactional
	public void sendPetLetterNotification(User user, String petName) {
		List<Notification> notifications = notificationRepository.findByUser(user);
		sendNotification(notifications, petName);
	}

	private void sendNotification(List<Notification> notifications, String petName) {
		for (Notification notification : notifications) {
			Message message = Message.builder()
				.setWebpushConfig(WebpushConfig.builder()
					.setNotification(WebpushNotification.builder()
						.setTitle(petName + "에게 편지가 왔어요")
						.build())
					.build())
				.setToken(notification.getDeviceToken())
				.build();

			try {
				FirebaseMessaging.getInstance().sendAsync(message).get();
			} catch (ExecutionException e) {
				log.error("main server - error : {}", e.getMessage());
				notificationRepository.delete(notification);
			} catch (InterruptedException e) {
				log.error("main server - error : {}", e.getMessage());
				notificationRepository.delete(notification);
			}
		}
	}
}
