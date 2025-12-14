package com.mosstroyinfo.api.controller;

import com.mosstroyinfo.api.dto.BlueprintResponse;
import com.mosstroyinfo.api.service.BlueprintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/blueprints")
@RequiredArgsConstructor
public class BlueprintController {
    private final BlueprintService blueprintService;

    @GetMapping
    public ResponseEntity<List<BlueprintResponse>> getAllBlueprints() {
        var blueprints = blueprintService.getAllBlueprints();
        return ResponseEntity.ok(blueprints);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlueprintResponse> getBlueprintById(@PathVariable UUID id) {
        var blueprint = blueprintService.getBlueprintById(id);
        return ResponseEntity.ok(blueprint);
    }
}

