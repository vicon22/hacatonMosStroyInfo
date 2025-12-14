package com.mosstroyinfo.api.controller;

import com.mosstroyinfo.api.dto.CreateProjectRequest;
import com.mosstroyinfo.api.dto.ProjectResponse;
import com.mosstroyinfo.api.service.AuthService;
import com.mosstroyinfo.api.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;
    private final AuthService authService;

    @PostMapping("/create")
    public ResponseEntity<?> createProject(
            @Valid @RequestBody CreateProjectRequest request,
            @CookieValue(value = "fm_session", required = false) String sessionId,
            Authentication authentication) {
        log.info("POST /api/projects/create - title: {}, blueprintId: {}, sessionId: {}", 
            request.getTitle(), request.getBlueprintId(),
            sessionId != null && sessionId.length() > 20 ? sessionId.substring(0, 20) + "..." : sessionId);
        UUID userId = getUserId(sessionId, authentication);
        if (userId == null) {
            log.warn("POST /api/projects/create - Unauthorized: no valid userId");
            return ResponseEntity.status(401).body("{\"error\":\"Unauthorized\"}");
        }

        log.info("POST /api/projects/create - userId: {}", userId);
        try {
            ProjectResponse project = projectService.createProject(
                    request.getBlueprintId(),
                    request.getTitle(),
                    userId
            );
            log.info("POST /api/projects/create - Project created successfully: {}", project.getId());
            return ResponseEntity.ok(project);
        } catch (RuntimeException e) {
            log.error("POST /api/projects/create - Error: {}", e.getMessage(), e);
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
        log.info("GET /api/projects - sessionId: {}, authentication: {}", 
            sessionId != null && sessionId.length() > 20 ? sessionId.substring(0, 20) + "..." : sessionId,
            authentication != null ? authentication.getName() : "null");
        UUID userId = getUserId(sessionId, authentication);
        if (userId == null) {
            log.warn("GET /api/projects - Unauthorized: no valid userId");
            return ResponseEntity.status(401).build();
        }
        
        log.info("GET /api/projects - userId: {}", userId);
        List<ProjectResponse> projects = projectService.getAllProjectsByUserId(userId);
        log.info("GET /api/projects - returning {} projects for userId: {}", projects.size(), userId);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(
            @PathVariable UUID id,
            @CookieValue(value = "fm_session", required = false) String sessionId,
            Authentication authentication) {
        log.info("GET /api/projects/{} - sessionId: {}, authentication: {}", 
            id,
            sessionId != null && sessionId.length() > 20 ? sessionId.substring(0, 20) + "..." : sessionId,
            authentication != null ? authentication.getName() : "null");
        UUID userId = getUserId(sessionId, authentication);
        if (userId == null) {
            log.warn("GET /api/projects/{} - Unauthorized: no valid userId", id);
            return ResponseEntity.status(401).build();
        }
        
        log.info("GET /api/projects/{} - userId: {}", id, userId);
        ProjectResponse project = projectService.getProjectByIdAndUserId(id, userId);
        return ResponseEntity.ok(project);
    }

    private UUID getUserId(String sessionId, Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof UUID) {
            UUID userId = (UUID) authentication.getPrincipal();
            log.debug("getUserId: using authentication principal: {}", userId);
            return userId;
        }
        if (sessionId != null) {
            UUID userId = authService.getUserIdBySession(sessionId);
            log.debug("getUserId: using sessionId, result: {}", userId);
            return userId;
        }
        log.debug("getUserId: no authentication and no sessionId");
        return null;
    }
}

