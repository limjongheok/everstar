package com.everstarbackmain.domain.aiAnswer.model;

import com.everstarbackmain.domain.pet.model.Pet;
import com.everstarbackmain.domain.quest.model.Quest;
import com.everstarbackmain.global.entity.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "ai_answer")
public class AiAnswer extends BaseTimeEntity {

	@EmbeddedId
	private AiAnswerId id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pet_id")
	private Pet pet;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "quest_id")
	private Quest quest;

	private String content;

	private String imageUrl;

	@Column(nullable = false)
	private String type;

	@Builder
	public AiAnswer(Pet pet, Quest quest, String content, String imageUrl, String type) {
		this.pet = pet;
		this.quest = quest;
		this.content = content;
		this.imageUrl = imageUrl;
		this.type = type;
	}
}
