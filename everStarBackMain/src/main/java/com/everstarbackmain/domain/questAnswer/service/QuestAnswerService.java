package com.everstarbackmain.domain.questAnswer.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.everstarbackmain.domain.memorialBook.util.MemorialBookScheduler;
import com.everstarbackmain.domain.quest.model.Quest;
import com.everstarbackmain.domain.quest.model.QuestType;
import com.everstarbackmain.domain.quest.repository.QuestRepository;
import com.everstarbackmain.domain.questAnswer.model.QuestAnswer;
import com.everstarbackmain.domain.questAnswer.requestDto.CreateAnswerRequestDto;
import com.everstarbackmain.global.openai.util.OpenAiClient;
import com.everstarbackmain.domain.pet.model.Pet;
import com.everstarbackmain.domain.pet.repository.PetRepository;
import com.everstarbackmain.domain.questAnswer.repository.QuestAnswerRepository;
import com.everstarbackmain.domain.sentimentAnalysis.model.SentimentAnalysis;
import com.everstarbackmain.domain.sentimentAnalysis.model.SentimentAnalysisResult;
import com.everstarbackmain.domain.sentimentAnalysis.repository.SentimentAnalysisRepository;
import com.everstarbackmain.domain.sentimentAnalysis.util.NaverCloudClient;
import com.everstarbackmain.domain.user.model.User;
import com.everstarbackmain.global.exception.CustomException;
import com.everstarbackmain.global.exception.ExceptionResponse;
import com.everstarbackmain.global.security.auth.PrincipalDetails;
import com.everstarbackmain.global.util.S3UploadUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class QuestAnswerService {

	private final QuestRepository questRepository;
	private final QuestAnswerRepository questAnswerRepository;
	private final PetRepository petRepository;
	private final SentimentAnalysisRepository sentimentAnalysisRepository;
	private final MemorialBookScheduler memorialBookScheduler;
	private final NaverCloudClient naverCloudClient;
	private final OpenAiClient openAiClient;
	private final S3UploadUtil s3UploadUtil;

	@Transactional
	public void createQuestAnswer(Authentication authentication, Long petId, Long questId,
		CreateAnswerRequestDto requestDto, MultipartFile imageFile) {
		User user = ((PrincipalDetails) authentication.getPrincipal()).getUser();

		Pet pet = petRepository.findByIdAndIsDeleted(petId, false)
			.orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_PET_EXCEPTION));

		Quest quest = questRepository.findById(questId)
			.orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_QUEST_EXCEPTION));

		if (requestDto.getType().equals(QuestType.TEXT.getType())) {
			QuestAnswer questAnswer = QuestAnswer.createTextQuestAnswer(pet, quest, requestDto);
			questAnswerRepository.save(questAnswer);
			plusPetQuestIndex(user, pet);
			return;
		}

		if (requestDto.getType().equals(QuestType.TEXT_IMAGE.getType())) {
			String imageUrl = s3UploadUtil.saveFile(imageFile);
			QuestAnswer questAnswer = QuestAnswer.createTextImageQuestAnswer(pet, quest, requestDto, imageUrl);
			questAnswerRepository.save(questAnswer);
			plusPetQuestIndex(user, pet);
			return;
		}

		String imageUrl = s3UploadUtil.saveFile(imageFile);
		QuestAnswer questAnswer = QuestAnswer.createImageQuestAnswer(pet, quest, requestDto, imageUrl);
		questAnswerRepository.save(questAnswer);
		plusPetQuestIndex(user, pet);
	}

	private void plusPetQuestIndex(User user, Pet pet) {
		pet.plusQuestIndex();
		int petQuestIndex = pet.getQuestIndex();

		if (petQuestIndex % 7 == 0) {
			analyseWeeklyQuestAnswer(pet.getId(), petQuestIndex);
		}

		if (petQuestIndex == 49) {
			memorialBookScheduler.scheduleMemorialBookActivation(user, pet.getId());
			analysisTotalQuestAnswer(pet.getId());
		}
	}

	private void analyseWeeklyQuestAnswer(Long petId, int petQuestIndex) {
		List<String> answerContents = questAnswerRepository.findContentByPetIdAndSpecificQuestIdsAndIsDeleted(petId,
			petQuestIndex - 3, petQuestIndex, false);

		String weeklyAnswerContent = answerContents.parallelStream()
			.collect(Collectors.joining(""));

		SentimentAnalysisResult sentimentAnalysisResult = naverCloudClient.analyseSentiment(weeklyAnswerContent);
		SentimentAnalysis sentimentAnalysis = sentimentAnalysisRepository.findByPetId(petId)
			.orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_SENTIMENT_ANALYSIS_EXCEPTION));

		sentimentAnalysis.addWeekResult(sentimentAnalysisResult.calculateAnalysis(), petQuestIndex / 7);
	}

	private void analysisTotalQuestAnswer(Long petId) {
		SentimentAnalysis sentimentAnalysis = sentimentAnalysisRepository.findByPetId(petId)
			.orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_SENTIMENT_ANALYSIS_EXCEPTION));

		sentimentAnalysis.addTotalResult(openAiClient.analysisTotalSentiment(sentimentAnalysis));
	}
}
