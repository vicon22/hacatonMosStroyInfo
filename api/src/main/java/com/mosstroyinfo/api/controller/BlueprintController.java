package com.mosstroyinfo.api.controller;

import com.mosstroyinfo.api.dto.BlueprintResponse;
import com.mosstroyinfo.api.service.BlueprintService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

import static lombok.AccessLevel.PRIVATE;

@RestController
@RequestMapping("/api/blueprints")
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class BlueprintController {
    BlueprintService blueprintService;

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

