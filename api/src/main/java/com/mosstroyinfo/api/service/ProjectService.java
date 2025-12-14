package com.mosstroyinfo.api.service;

import com.mosstroyinfo.api.dto.ProjectResponse;
import com.mosstroyinfo.api.model.Project;
import com.mosstroyinfo.api.repository.BlueprintRepository;
import com.mosstroyinfo.api.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final BlueprintRepository blueprintRepository;

    public List<ProjectResponse> getAllProjectsByUserId(UUID userId) {
        return projectRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ProjectResponse getProjectByIdAndUserId(UUID id, UUID userId) {
        var project = projectRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return toResponse(project);
    }

    @Transactional
    public ProjectResponse createProject(UUID blueprintId, String title, UUID userId) {
        // Проверяем, что blueprint существует
        blueprintRepository.findById(blueprintId)
                .orElseThrow(() -> new RuntimeException("Blueprint not found"));

        // Создаем новый проект (ID будет сгенерирован автоматически через @UuidGenerator)
        var project = new Project();
        project.setTitle(title);
        project.setStatus(Project.ProjectStatus.NEW);
        project.setBlueprintId(blueprintId);
        project.setUserId(userId);
        project.setDocuments(new java.util.ArrayList<>());
        project.setStreamUrls(new java.util.ArrayList<>());

        var savedProject = projectRepository.save(project);
        return toResponse(savedProject);
    }

    private ProjectResponse toResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getStatus().toApiValue(),
                project.getBlueprintId(),
                project.getDocuments(),
                project.getStreamUrls()
        );
    }
}

