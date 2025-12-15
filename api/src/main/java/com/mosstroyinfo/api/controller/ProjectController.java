package com.mosstroyinfo.api.controller;

import com.mosstroyinfo.api.dto.CreateProjectRequest;
import com.mosstroyinfo.api.dto.ProjectResponse;
import com.mosstroyinfo.api.service.AuthService;
import com.mosstroyinfo.api.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static lombok.AccessLevel.PRIVATE;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class ProjectController {
    ProjectService projectService;
    AuthService authService;

    @PostMapping("/create")
    public ResponseEntity<?> createProject(
            @Valid @RequestBody CreateProjectRequest request,
            @CookieValue(value = "fm_session", required = false) String sessionId,
            Authentication authentication) {
        var userId = getUserId(sessionId, authentication);
        if (userId == null) {
            return ResponseEntity.status(401).body("{\"error\":\"Unauthorized\"}");
        }

        try {
            var project = projectService.createProject(
                    request.blueprintId(),
                    request.title(),
                    userId
            );
            return ResponseEntity.ok(project);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(404).body("{\"error\":\"Blueprint not found\"}");
            }
            return ResponseEntity.status(500).body("{\"error\":\"Internal server error\"}");
        }
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects(
            @CookieValue(value = "fm_session", required = false) String sessionId,
            Authentication authentication) {
        var userId = getUserId(sessionId, authentication);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        var projects = projectService.getAllProjectsByUserId(userId);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(
            @PathVariable UUID id,
            @CookieValue(value = "fm_session", required = false) String sessionId,
            Authentication authentication) {
        var userId = getUserId(sessionId, authentication);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        var project = projectService.getProjectByIdAndUserId(id, userId);
        return ResponseEntity.ok(project);
    }

    private UUID getUserId(String sessionId, Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof UUID) {
            return (UUID) authentication.getPrincipal();
        }
        if (sessionId != null) {
            return authService.getUserIdBySession(sessionId);
        }
        return null;
    }
}

