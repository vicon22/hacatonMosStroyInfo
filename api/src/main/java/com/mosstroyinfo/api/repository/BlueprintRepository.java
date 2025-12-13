package com.mosstroyinfo.api.repository;

import com.mosstroyinfo.api.model.Blueprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BlueprintRepository extends JpaRepository<Blueprint, UUID> {
}

