package com.everstarbackmain.domain.pet.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.everstarbackmain.domain.pet.message.SuccessPetMessage;
import com.everstarbackmain.domain.pet.requestdto.CreatePetRequestDto;
import com.everstarbackmain.domain.pet.requestdto.UpdatePetIntroductionDto;
import com.everstarbackmain.domain.pet.responsedto.EnrolledPetsResponseDto;
import com.everstarbackmain.domain.pet.responsedto.MyPagePetInfoResponseDto;
import com.everstarbackmain.domain.pet.service.PetService;
import com.everstarbackmain.global.util.HttpResponseUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/pets")
@Slf4j(topic = "elk")
public class PetController {

	private final PetService petService;
	private final HttpResponseUtil responseUtil;

	@PostMapping
	public ResponseEntity<Map<String, Object>> addPet(Authentication authentication,
		@RequestBody @Valid CreatePetRequestDto requestDto) {
		petService.createPet(authentication, requestDto);
		ResponseEntity<Map<String, Object>> response = responseUtil.createResponse(
			SuccessPetMessage.SUCCESS_CREATE_PET);
		log.info("main server - request : {}", requestDto);
		log.info("main server - response : {}", response);
		return response;
	}

	@PutMapping("/{pet-id}")
	public ResponseEntity<Map<String, Object>> updatePetIntroduction(Authentication authentication,
		@PathVariable("pet-id") Long petId, @RequestBody @Valid UpdatePetIntroductionDto requestDto) {
		petService.updatePetIntroduction(authentication, petId, requestDto);
		ResponseEntity<Map<String, Object>> response = responseUtil.createResponse(
			SuccessPetMessage.SUCCESS_UPDATE_PET_INTRODUCTION);

		log.info("main server - request : {}", requestDto);
		log.info("main-server - response : {}", response);
		return response;
	}

	@GetMapping
	public ResponseEntity<Map<String, Object>> getAllUserPets(Authentication authentication) {
		List<EnrolledPetsResponseDto> responseDtos = petService.getAllUserPets(authentication);
		ResponseEntity<Map<String, Object>> response = responseUtil.createResponse(responseDtos);
		log.info("main server - request : user {},", authentication);
		log.info("main server - response : 유저 반려동물 목록{}", responseDtos);
		return response;
	}

	@GetMapping("/{pet-id}")
	public ResponseEntity<Map<String, Object>> getMyPetInfo(Authentication authentication,
		@PathVariable("pet-id") Long petId) {
		MyPagePetInfoResponseDto responseDto = petService.getMyPetInfo(authentication, petId);
		ResponseEntity<Map<String, Object>> response = responseUtil.createResponse(responseDto);
		log.info("main server - request : user {},", authentication);
		log.info("main server - response : 유저 마이페이지 동물정보{}", responseDto);
		return response;
	}

}