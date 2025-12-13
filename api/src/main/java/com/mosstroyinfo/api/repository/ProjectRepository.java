package com.mosstroyinfo.api.repository;

import com.mosstroyinfo.api.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    @Query("SELECT p FROM Project p WHERE p.userId = :userId")
    List<Project> findByUserId(@Param("userId") UUID userId);
    
    @Query("SELECT p FROM Project p WHERE p.id = :id AND p.userId = :userId")
    Optional<Project> findByIdAndUserId(@Param("id") UUID id, @Param("userId") UUID userId);
}

