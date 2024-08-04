package com.everstarbackmain.domain.pet.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.everstarbackmain.domain.pet.model.Pet;
import com.everstarbackmain.domain.user.model.User;

public interface PetRepository extends JpaRepository<Pet, Long> {

	@EntityGraph(attributePaths = "user")
	Optional<Pet> findByIdAndIsDeleted(Long id, boolean isDeleted);

	@EntityGraph(attributePaths = "user")
	Optional<Pet> findByIdAndUserAndIsDeleted(Long id, User user, boolean isDeleted);

	boolean existsByIdAndUserAndIsDeleted(Long id, User user, boolean isDeleted);

	@EntityGraph(attributePaths = "user")
	List<Pet> findAllByUserIdAndIsDeleted(Long id, boolean isDeleted);
}
