package com.mosstroyinfo.api.service;

import com.mosstroyinfo.api.dto.BlueprintResponse;
import com.mosstroyinfo.api.model.Blueprint;
import com.mosstroyinfo.api.repository.BlueprintRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static lombok.AccessLevel.PRIVATE;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class BlueprintService {
    BlueprintRepository blueprintRepository;

    public List<BlueprintResponse> getAllBlueprints() {
        return blueprintRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public BlueprintResponse getBlueprintById(UUID id) {
        var blueprint = blueprintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blueprint not found"));
        return toResponse(blueprint);
    }

    private BlueprintResponse toResponse(Blueprint blueprint) {
        return new BlueprintResponse(
                blueprint.getId(),
                blueprint.getTitle(),
                blueprint.getImageUrl(),
                blueprint.getPrice(),
                blueprint.getMaterial().name(),
                blueprint.getSeriality().name(),
                blueprint.getFloors(),
                blueprint.getRooms(),
                blueprint.getBedrooms(),
                blueprint.getBathrooms(),
                blueprint.getArea()
        );
    }
}

