package com.mosstroyinfo.api.controller;

import com.mosstroyinfo.api.dto.ChangeProjectStateRequest;
import com.mosstroyinfo.api.dto.CreateProjectRequest;
import com.mosstroyinfo.api.dto.ProjectResponse;
import com.mosstroyinfo.api.service.AuthService;
import com.mosstroyinfo.api.service.ProjectService;
import lombok.experimental.FieldDefaults;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static lombok.AccessLevel.PRIVATE;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@FieldDefaults(level = PRIVATE)
class ProjectControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    ProjectService projectService;

    @MockBean
    AuthService authService;

    @Test
    void createProject_success() throws Exception {
        // Arrange
        var userId = UUID.randomUUID();
        var blueprintId = UUID.randomUUID();
        var projectId = UUID.randomUUID();

        var request = new CreateProjectRequest();
        request.setBlueprint_id(blueprintId.toString());
        request.setTitle("Test Project");

        var mockResponse = new ProjectResponse();
        mockResponse.setId(projectId);
        mockResponse.setTitle("Test Project");
        mockResponse.setStatus("NEW");
        mockResponse.setBlueprint_id(blueprintId);
        mockResponse.setDocuments(Collections.emptyList());
        mockResponse.setStream_urls(Collections.emptyList());
        
        when(authService.getUserIdBySession("session-123")).thenReturn(userId);
        when(authService.isValidSession("session-123")).thenReturn(true);
        when(projectService.createProject(blueprintId, "Test Project", userId)).thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(post("/api/projects/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"blueprint_id\":\"" + blueprintId + "\",\"title\":\"Test Project\"}")
                .cookie(new jakarta.servlet.http.Cookie("fm_session", "session-123")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(projectId.toString()))
                .andExpect(jsonPath("$.title").value("Test Project"))
                .andExpect(jsonPath("$.status").value("NEW"))
                .andExpect(jsonPath("$.blueprint_id").value(blueprintId.toString()))
                .andExpect(jsonPath("$.documents").isArray())
                .andExpect(jsonPath("$.documents").isEmpty())
                .andExpect(jsonPath("$.stream_urls").isArray())
                .andExpect(jsonPath("$.stream_urls").isEmpty());
    }

    @Test
    void getAllProjects_success() throws Exception {
        // Arrange
        var userId = UUID.randomUUID();
        var projectId = UUID.randomUUID();
        var blueprintId = UUID.randomUUID();

        var project = new ProjectResponse();
        project.setId(projectId);
        project.setTitle("Test Project");
        project.setStatus("NEW");
        project.setBlueprint_id(blueprintId);
        project.setDocuments(Collections.emptyList());
        project.setStream_urls(Collections.emptyList());
        
        when(authService.getUserIdBySession("session-123")).thenReturn(userId);
        when(authService.isValidSession("session-123")).thenReturn(true);
        when(projectService.getAllProjectsByUserId(userId)).thenReturn(List.of(project));

        // Act & Assert
        mockMvc.perform(get("/api/projects")
                .cookie(new jakarta.servlet.http.Cookie("fm_session", "session-123")))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(projectId.toString()))
                .andExpect(jsonPath("$[0].title").value("Test Project"))
                .andExpect(jsonPath("$[0].status").value("NEW"))
                .andExpect(jsonPath("$[0].blueprint_id").value(blueprintId.toString()))
                .andExpect(jsonPath("$[0].documents").isArray())
                .andExpect(jsonPath("$[0].documents").isEmpty())
                .andExpect(jsonPath("$[0].stream_urls").isArray())
                .andExpect(jsonPath("$[0].stream_urls").isEmpty());
    }

    @Test
    void getProjectById_success() throws Exception {
        // Arrange
        var projectId = UUID.randomUUID();
        var userId = UUID.randomUUID();
        var blueprintId = UUID.randomUUID();

        var mockResponse = new ProjectResponse();
        mockResponse.setId(projectId);
        mockResponse.setTitle("Test Project");
        mockResponse.setStatus("NEW");
        mockResponse.setBlueprint_id(blueprintId);
        mockResponse.setDocuments(Collections.emptyList());
        mockResponse.setStream_urls(Collections.emptyList());
        
        when(authService.getUserIdBySession("session-123")).thenReturn(userId);
        when(authService.isValidSession("session-123")).thenReturn(true);
        when(projectService.getProjectByIdAndUserId(projectId, userId)).thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(get("/api/projects/" + projectId)
                .cookie(new jakarta.servlet.http.Cookie("fm_session", "session-123")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(projectId.toString()))
                .andExpect(jsonPath("$.title").value("Test Project"))
                .andExpect(jsonPath("$.status").value("NEW"))
                .andExpect(jsonPath("$.blueprint_id").value(blueprintId.toString()))
                .andExpect(jsonPath("$.documents").isArray())
                .andExpect(jsonPath("$.documents").isEmpty())
                .andExpect(jsonPath("$.stream_urls").isArray())
                .andExpect(jsonPath("$.stream_urls").isEmpty());
    }

    @Test
    void setProjectStateById_success() throws Exception {
        // Arrange
        var projectId = UUID.randomUUID();
        var userId = UUID.randomUUID();
        var blueprintId = UUID.randomUUID();

        var request = new ChangeProjectStateRequest();
        request.setStatus(com.mosstroyinfo.api.model.Project.ProjectStatus.pending);

        var mockResponse = new ProjectResponse();
        mockResponse.setId(projectId);
        mockResponse.setTitle("Test Project");
        mockResponse.setStatus("pending");
        mockResponse.setBlueprint_id(blueprintId);
        mockResponse.setDocuments(Collections.emptyList());
        mockResponse.setStream_urls(Collections.emptyList());
        
        when(authService.getUserIdBySession("session-123")).thenReturn(userId);
        when(authService.isValidSession("session-123")).thenReturn(true);
        when(projectService.updateProjectState(projectId, com.mosstroyinfo.api.model.Project.ProjectStatus.pending))
                .thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(patch("/api/projects/" + projectId + "/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"pending\"}")
                .cookie(new jakarta.servlet.http.Cookie("fm_session", "session-123")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(projectId.toString()))
                .andExpect(jsonPath("$.status").value("pending"));
    }
}