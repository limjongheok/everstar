package com.everstarbackmain.domain.quest.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Date;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Component;

import com.everstarbackmain.domain.quest.service.QuestService;
import com.everstarbackmain.domain.user.model.User;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class QuestScheduler {

	private final TaskScheduler taskScheduler;
	private final QuestService questService;
	private final ApplicationEventPublisher applicationEventPublisher;

	// 펫 생성 시 최초 퀘스트 수신 및 스케줄링
	public void scheduleInitialQuest(User user, Long petId) {
		questService.startInitialQuest(user, petId);

		// 다음 날 퀘스트 수신 스케줄링
		scheduleNextDayQuest(user, petId);
	}

	// 다음 날 퀘스트 스케줄링
	public void scheduleNextDayQuest(User user, Long petId) {
		LocalTime questReceptionTime = user.getQuestReceptionTime();
		LocalDateTime nextQuestTime = LocalDateTime.of(LocalDate.now().plusDays(1), questReceptionTime);
		Date nextQuestDate = Date.from(nextQuestTime.atZone(ZoneId.systemDefault()).toInstant());

		taskScheduler.schedule(() -> questService.receiveQuest(user, petId), nextQuestDate);
	}
}
