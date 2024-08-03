package com.everstarbackmain.domain.petterLetter.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.everstarbackmain.domain.petterLetter.model.PetLetter;
import com.everstarbackmain.domain.petterLetter.responsedto.PetLetterResponseDto;
import com.everstarbackmain.domain.user.model.User;

@Repository
public interface PetLetterRepository extends JpaRepository<PetLetter, Long>, PetLetterRepositoryCustom {

	@Override
	Page<PetLetterResponseDto> findPetLettersByPetId(User user, Long petId, Pageable pageable);
}
