package com.mosstroyinfo.api.controller;

import com.mosstroyinfo.api.dto.BlueprintResponse;
import com.mosstroyinfo.api.service.BlueprintService;
import lombok.experimental.FieldDefaults;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static lombok.AccessLevel.PRIVATE;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@FieldDefaults(level = PRIVATE)
class BlueprintControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    BlueprintService blueprintService;

    @Test
    void getAllBlueprints_success() throws Exception {
        // Arrange
        var blueprintId = UUID.randomUUID();
        var blueprint = new BlueprintResponse();
        blueprint.setId(blueprintId);
        blueprint.setTitle("Test Blueprint");
        blueprint.setImage_url("http://example.com/image.jpg");
        blueprint.setPrice(1000000L);
        blueprint.setMaterial("brick");
        blueprint.setSeriality("1-111");
        blueprint.setFloors(2);
        blueprint.setRooms(4);
        blueprint.setBedrooms(3);
        blueprint.setBathrooms(2);
        blueprint.setArea(100);
        
        when(blueprintService.getAllBlueprints()).thenReturn(List.of(blueprint));

        // Act & Assert
        mockMvc.perform(get("/api/blueprints")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(blueprintId.toString()))
                .andExpect(jsonPath("$[0].title").value("Test Blueprint"))
                .andExpect(jsonPath("$[0].image_url").value("http://example.com/image.jpg"))
                .andExpect(jsonPath("$[0].material").value("brick"))
                .andExpect(jsonPath("$[0].price").value(1000000))
                .andExpect(jsonPath("$[0].seriality").value("1-111"))
                .andExpect(jsonPath("$[0].floors").value(2))
                .andExpect(jsonPath("$[0].rooms").value(4))
                .andExpect(jsonPath("$[0].bedrooms").value(3))
                .andExpect(jsonPath("$[0].bathrooms").value(2))
                .andExpect(jsonPath("$[0].area").value(100));
    }

    @Test
    void getBlueprintById_success() throws Exception {
        // Arrange
        var blueprintId = UUID.randomUUID();
        var blueprint = new BlueprintResponse();
        blueprint.setId(blueprintId);
        blueprint.setTitle("Test Blueprint");
        blueprint.setImage_url("http://example.com/image.jpg");
        blueprint.setPrice(1000000L);
        blueprint.setMaterial("brick");
        blueprint.setSeriality("1-111");
        blueprint.setFloors(2);
        blueprint.setRooms(4);
        blueprint.setBedrooms(3);
        blueprint.setBathrooms(2);
        blueprint.setArea(100);
        
        when(blueprintService.getBlueprintById(blueprintId)).thenReturn(blueprint);

        // Act & Assert
        mockMvc.perform(get("/api/blueprints/" + blueprintId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(blueprintId.toString()))
                .andExpect(jsonPath("$.title").value("Test Blueprint"))
                .andExpect(jsonPath("$.image_url").value("http://example.com/image.jpg"))
                .andExpect(jsonPath("$.material").value("brick"))
                .andExpect(jsonPath("$.price").value(1000000))
                .andExpect(jsonPath("$.seriality").value("1-111"))
                .andExpect(jsonPath("$.floors").value(2))
                .andExpect(jsonPath("$.rooms").value(4))
                .andExpect(jsonPath("$.bedrooms").value(3))
                .andExpect(jsonPath("$.bathrooms").value(2))
                .andExpect(jsonPath("$.area").value(100));
    }
}