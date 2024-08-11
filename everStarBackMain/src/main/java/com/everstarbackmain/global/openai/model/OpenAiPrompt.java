package com.everstarbackmain.global.openai.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public enum OpenAiPrompt {

	ANALYSIS_TOTAL_SENTIMENT_PROMPT("7주간의 각 주차별 감정 분석 결과를 입력으로 받아서 사용자의 감정이 어떻게 변화하였는지를 알려줍니다. " +
		"0에 가까울수록 부정적인 감정을 겪었고, 100에 가까울수록 긍정적인 감정을 겪었습니다." +
		"몇주차인지는 언급하지 않고, 자연스러운 흐름으로 일상생활과 연관지어서 부드러운 문장으로 알려줍니다. 최대 3문장으로 요약해서 알려줍니다."),
	WRITE_PET_LETTER_ANSWER_PROMPT("당신의 애완동물 %s가 보내는 답장입니다. 편지를 분석하여 %s의 관점에서 감동적이고 공감할 수 있는 답장을 작성해 주세요.\n\n" +
		"편지 내용: \"%s\"\n\n" +
		"애완동물 이름: \"%s\"\n" +
		"작성자 이름: \"%s\"\n\n" +
		"답장을 작성할 때 고려 사항:\n" +
		"1. 애완동물이 직접 말하는 것처럼 작성해 주세요.\n" +
		"2. 편지에 언급된 추억에 감사해 주세요.\n" +
		"3. 사랑의 메시지를 전달해 주세요.\n" +
		"4. 따뜻하고 진심 어린 톤으로 작성해 주세요.\n" +
		"5. 너무 딱딱하지 않게 문장이 부드럽게 작성해주세요\n" +
		"6. 최대 varchar(255)로 글자를 작성해 주세요.\n\n" +
		"감사합니다."),
	WRITE_PET_LETTER_PROMPT("당신의 애완동물 %s가 보내는 답장입니다. 편지를 분석하여 %s의 관점에서 감동적이고 공감할 수 있는 답장을 작성해 주세요.\n\n" +
		"편지 내용: \"%s\"\n\n" +
		"애완동물 이름: \"%s\"\n" +
		"작성자 이름: \"%s\"\n\n" +
		"답장을 작성할 때 고려 사항:\n" +
		"1. 애완동물이 직접 말하는 것처럼 작성해 주세요.\n" +
		"2. 편지에 언급된 추억에 감사해 주세요.\n" +
		"3. 사랑의 메시지를 전달해 주세요.\n" +
		"4. 따뜻하고 진심 어린 톤으로 작성해 주세요.\n" +
		"5. 너무 딱딱하지 않게 문장이 부드럽게 11살에서 12살이 작성한 것 처럼작성해 주세요.\n" +
		"6. 최대 varchar(255)로 글자를 작성해 주세요.\n\n" +
		"감사합니다."),
	WRITE_PET_TEXT_TO_TEXT_ANSWER_PROMPT("당신의 애완동물 %s가 보내는 답장입니다.\n" +
		"당신은 질문에 대해 다음과 같은 답변을 했으며, 답변에 대해 %s의 관점에서 감동적이고 공감할 수 있는 답장을 작성해 주세요.\n\n" +
		"질문 내용: \"%s\"\n\n" +
		"당신의 답변 내용: \"%s\"\n\n" +
		"애완동물 이름: \"%s\"\n" +
		"애완동물과의 관계: \"%s\"\n" +
		"애완동물의 성격: \"%s\"\n" +
		"작성자 이름: \"%s\"\n\n" +
		"답장을 작성할 때 고려 사항:\n" +
		"1. 애완동물이 직접 말하는 것처럼 작성해 주세요.\n" +
		"2. 답변에 언급된 추억에 감사해 주세요.\n" +
		"3. 사랑의 메시지를 전달해 주세요.\n" +
		"4. 따뜻하고 진심 어린 톤으로 작성해 주세요.\n" +
		"5. 너무 딱딱하지 않게 문장이 부드럽게 11살에서 12살이 작성한 것 처럼작성해 주세요.\n" +
		"6. 최대 varchar(255)로 글자를 작성해 주세요.\n\n"),
	WRITE_PET_TEXT_IMAGE_TO_TEXT_ANSWER_PROMPT("당신의 애완동물 %s가 보내는 답장입니다.\n" +
		"당신은 질문에 대해 다음과 같은 답변을 했으며, 답변에 대해 %s의 관점에서 감동적이고 공감할 수 있는 답장을 작성해 주세요.\n\n" +
		"질문 내용: \"%s\"\n\n" +
		"당신의 답변 내용: \"%s\"\n\n" +
		"애완동물 이름: \"%s\"\n" +
		"애완동물과의 관계: \"%s\"\n" +
		"애완동물의 성격: \"%s\"\n" +
		"작성자 이름: \"%s\"\n\n" +
		"답장을 작성할 때 고려 사항:\n" +
		"1. 첨부된 사진에 있는 내용도 언급하며 작성해주세요.\n" +
		"2. 애완동물이 직접 말하는 것처럼 작성해 주세요.\n" +
		"3. 답변에 언급된 추억에 감사해 주세요.\n" +
		"4. 사랑의 메시지를 전달해 주세요.\n" +
		"5. 따뜻하고 진심 어린 톤으로 작성해 주세요.\n" +
		"6. 너무 딱딱하지 않게 문장이 부드럽게 11살에서 12살이 작성한 것 처럼작성해 주세요.\n" +
		"7. 최대 varchar(255)로 글자를 작성해 주세요.\n\n"),
	WRITE_PET_TEXT_TO_IMAGE_ANSWER_PROMPT("사용자의 질문에 대한 답변 내용에 맞춰서 그림을 그려주세요.\n" +
		"질문 내용: \"%s\"\n\n" +
		"사용자의 답변 내용: \"%s\"\n\n" +
		"반려동물 종류: \"%s\"\n" +
		"이미지를 생성할 때 고려 사항:\n" +
		"1. 자연스럽게 그려주세요.\n" +
		"2. 문자를 넣지 말아주세요.\n" +
		"3. 반려동물은 그리지 말아주세요.\n"),
	MAKE_DALLE_IMAGE_PROMPT("원하는 이미지: %s\n" +
		"============\n\n" +
		"Dalle를 사용해서 입력한 사진을 \"원하는 이미지\"에 맞춰서 이미지를 만들려고 해.\n" +
		"이미지를 만드는데에 필요한 텍스트 프롬프트를 자세히 알려줘. 동물의 종류도 자세히 포함해서 만들어서 영어로 답변해줘.\n" +
		"프롬프트는 \"\"로 감싸서 알려줘\n")
	;

	private final String prompt;
}
