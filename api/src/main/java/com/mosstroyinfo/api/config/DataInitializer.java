package com.mosstroyinfo.api.config;

import com.mosstroyinfo.api.model.Blueprint;
import com.mosstroyinfo.api.model.Project;
import com.mosstroyinfo.api.model.User;
import com.mosstroyinfo.api.repository.BlueprintRepository;
import com.mosstroyinfo.api.repository.ProjectRepository;
import com.mosstroyinfo.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
        private final UserRepository userRepository;
        private final ProjectRepository projectRepository;
        private final BlueprintRepository blueprintRepository;

        @Override
        public void run(String... args) {
                // Инициализация пользователей
                UUID adminId = null;
                UUID userId = null;

                if (userRepository.count() == 0) {
                        User admin = new User();
                        admin.setId(UUID.fromString("550e8400-e29b-41d4-a716-446655440099"));
                        admin.setEmail("admin");
                        admin.setPassword("123");
                        admin.setFirstName("Администратор");
                        admin.setLastName("Системы");
                        admin = userRepository.save(admin);
                        adminId = admin.getId();

                        User user1 = new User();
                        user1.setEmail("user@example.com");
                        user1.setPassword("password");
                        user1.setFirstName("Иван");
                        user1.setLastName("Иванов");
                        user1 = userRepository.save(user1);
                        userId = user1.getId();
                } else {
                        // Получаем существующих пользователей
                        adminId = userRepository.findByEmail("admin")
                                        .map(User::getId)
                                        .orElse(null);
                        userId = userRepository.findByEmail("user@example.com")
                                        .map(User::getId)
                                        .orElse(null);
                }

                // Инициализация вариантов проектов (blueprints)
                if (blueprintRepository.count() == 0) {
                        List<Blueprint> blueprints = Arrays.asList(
                                        createBlueprint("Проект Д-1", "/media/d1.webp", 10_000_000L,
                                                        Blueprint.Material.bricks, Blueprint.Seriality.serial, 3, 6, 3,
                                                        2, 250),
                                        createBlueprint("Проект Д-2", "/media/d2.jpg", 15_000_000L,
                                                        Blueprint.Material.aeratedConcrete,
                                                        Blueprint.Seriality.individual, 2, 7, 3, 2, 300),
                                        createBlueprint("Проект Д-3", "/media/d3.jpg", 8_000_000L,
                                                        Blueprint.Material.aeratedConcrete, Blueprint.Seriality.serial,
                                                        2, 5, 2, 1, 150),
                                        createBlueprint("Проект Б-1", "/media/b1.jpg", 5_000_000L,
                                                        Blueprint.Material.timber, Blueprint.Seriality.serial, 1, 3, 0,
                                                        1, 100),
                                        createBlueprint("Проект Б-2", "/media/b2.jpg", 6_000_000L,
                                                        Blueprint.Material.timber, Blueprint.Seriality.serial, 1, 3, 0,
                                                        1, 120),
                                        createBlueprint("Проект С-1", "/media/s1.jpg", 1_000_000L,
                                                        Blueprint.Material.timber, Blueprint.Seriality.serial, 1, 1, 0,
                                                        0, 40),
                                        createBlueprint("Проект С-2", "/media/s2.jpg", 1_100_000L,
                                                        Blueprint.Material.aeratedConcrete, Blueprint.Seriality.serial,
                                                        1, 1, 0, 0, 45),
                                        createBlueprint("Проект Г-1", "/media/g1.jpg", 1_500_000L,
                                                        Blueprint.Material.bricks, Blueprint.Seriality.serial, 1, 1, 0,
                                                        0, 55),
                                        createBlueprint("Проект Г-2", "/media/g2.jpg", 500_000L,
                                                        Blueprint.Material.aeratedConcrete, Blueprint.Seriality.serial,
                                                        1, 1, 0, 0, 20));
                        blueprintRepository.saveAll(blueprints);
                }

                // Инициализация проектов
                if (projectRepository.count() == 0) {
                        // Получаем ID пользователей, если они еще не были получены
                        if (adminId == null) {
                                adminId = userRepository.findByEmail("admin")
                                                .map(User::getId)
                                                .orElse(null);
                        }
                        if (userId == null) {
                                userId = userRepository.findByEmail("user@example.com")
                                                .map(User::getId)
                                                .orElse(null);
                        }

                        if (adminId != null && userId != null) {
                                // Получаем ID blueprints для создания проектов
                                List<Blueprint> allBlueprints = blueprintRepository.findAll();
                                if (allBlueprints.size() >= 4) {
                                        UUID blueprint101 = allBlueprints.get(0).getId(); // Проект Д-1
                                        UUID blueprint201 = allBlueprints.get(3).getId(); // Проект Б-1
                                        UUID blueprint103 = allBlueprints.get(2).getId(); // Проект Д-3
                                        UUID blueprint302 = allBlueprints.get(6).getId(); // Проект С-2
                                        UUID blueprint402 = allBlueprints.get(8).getId(); // Проект Г-2

                                        List<Project> projects = Arrays.asList(
                                                        // Проекты для admin
                                                        createProject(UUID.fromString(
                                                                        "550e8400-e29b-41d4-a716-446655440000"),
                                                                        "Коттедж", Project.ProjectStatus.NEW,
                                                                        blueprint101, adminId,
                                                                        Arrays.asList("https://example.com/doc1.pdf",
                                                                                        "https://example.com/doc2.pdf"),
                                                                        Arrays.asList("https://stream.example.com/project1")),
                                                        createProject(UUID.fromString(
                                                                        "550e8400-e29b-41d4-a716-446655440001"),
                                                                        "Баня", Project.ProjectStatus.approval,
                                                                        blueprint201, adminId,
                                                                        Arrays.asList("https://example.com/doc3.pdf"),
                                                                        Arrays.asList("https://stream.example.com/project2")),
                                                        createProject(UUID.fromString(
                                                                        "550e8400-e29b-41d4-a716-446655440002"),
                                                                        "Гостевой дом", Project.ProjectStatus.pending,
                                                                        blueprint103, adminId,
                                                                        Arrays.asList("https://example.com/doc4.pdf",
                                                                                        "https://example.com/doc5.pdf"),
                                                                        Arrays.asList()),
                                                        createProject(UUID.fromString(
                                                                        "550e8400-e29b-41d4-a716-446655440003"),
                                                                        "Сарай", Project.ProjectStatus.completed,
                                                                        blueprint302, adminId,
                                                                        Arrays.asList("https://example.com/doc6.pdf"),
                                                                        Arrays.asList("https://stream.example.com/project4")),
                                                        createProject(UUID.fromString(
                                                                        "550e8400-e29b-41d4-a716-446655440004"),
                                                                        "Гараж", Project.ProjectStatus.completed,
                                                                        blueprint402, adminId,
                                                                        Arrays.asList("https://example.com/doc7.pdf"),
                                                                        Arrays.asList("https://stream.example.com/project5")));
                                        projectRepository.saveAll(projects);
                                }
                        }
                }
        }

        private Blueprint createBlueprint(String title, String imageUrl, Long price,
                        Blueprint.Material material, Blueprint.Seriality seriality,
                        Integer floors, Integer rooms, Integer bedrooms, Integer bathrooms, Integer area) {
                Blueprint blueprint = new Blueprint();
                blueprint.setTitle(title);
                blueprint.setImageUrl(imageUrl);
                blueprint.setPrice(price);
                blueprint.setMaterial(material);
                blueprint.setSeriality(seriality);
                blueprint.setFloors(floors);
                blueprint.setRooms(rooms);
                blueprint.setBedrooms(bedrooms);
                blueprint.setBathrooms(bathrooms);
                blueprint.setArea(area);
                return blueprint;
        }

        private Project createProject(UUID id, String title, Project.ProjectStatus status, UUID blueprintId,
                        UUID userId,
                        List<String> documents, List<String> streamUrls) {
                Project project = new Project();
                project.setId(id);
                project.setTitle(title);
                project.setStatus(status);
                project.setBlueprintId(blueprintId);
                project.setUserId(userId);
                if (documents != null) {
                        project.setDocuments(documents);
                }
                if (streamUrls != null) {
                        project.setStreamUrls(streamUrls);
                }
                return project;
        }
}
