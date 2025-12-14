package com.mosstroyinfo.api.controller;

import com.mosstroyinfo.api.dto.BlueprintResponse;
import com.mosstroyinfo.api.service.BlueprintService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/blueprints")
@RequiredArgsConstructor
public class BlueprintController {
    private final BlueprintService blueprintService;

    @GetMapping
    public ResponseEntity<List<BlueprintResponse>> getAllBlueprints() {
        log.info("GET /api/blueprints - Request to get all blueprints");
        List<BlueprintResponse> blueprints = blueprintService.getAllBlueprints();
        log.info("GET /api/blueprints - Returning {} blueprints", blueprints.size());
        return ResponseEntity.ok(blueprints);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlueprintResponse> getBlueprintById(@PathVariable UUID id) {
        log.info("GET /api/blueprints/{} - Request to get blueprint by id", id);
        BlueprintResponse blueprint = blueprintService.getBlueprintById(id);
        if (blueprint != null) {
            log.info("GET /api/blueprints/{} - Blueprint found: {}", id, blueprint.getTitle());
        } else {
            log.warn("GET /api/blueprints/{} - Blueprint not found", id);
        }
        return ResponseEntity.ok(blueprint);
    }
}

