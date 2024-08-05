package com.b101.everStarBackChat.domain.chat.requestDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
public class ChatMessage {

	private MessageType type;
	private String roomId;
	private String message;
	private String sender;

	public void updateEnterMessage(String enterMessage) {
		this.message = enterMessage;
	}
}
