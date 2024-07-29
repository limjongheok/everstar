package com.everstarbackmain.domain.quest.responseDto;

import com.everstarbackmain.domain.quest.model.Quest;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Builder
@Getter
public class QuestDetailResponseDto {

	private Long id;
	private String content;
	private String type;

	public static QuestDetailResponseDto createQuestDetailResponseDto(Quest quest) {
		return QuestDetailResponseDto.builder()
			.id(quest.getId())
			.content(quest.getContent())
			.type(quest.getType().getType())
			.build();
	}
}
