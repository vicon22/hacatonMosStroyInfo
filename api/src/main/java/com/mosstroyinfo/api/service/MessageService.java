package com.mosstroyinfo.api.service;

import com.mosstroyinfo.api.dto.CreateMessageRequest;
import com.mosstroyinfo.api.dto.MessageResponse;
import com.mosstroyinfo.api.model.Message;
import com.mosstroyinfo.api.model.User;
import com.mosstroyinfo.api.repository.MessageRepository;
import com.mosstroyinfo.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public List<MessageResponse> getMessagesByRoomId(String roomId) {
        log.info("Getting messages for roomId: {}", roomId);
        List<Message> messages = messageRepository.findByRoomIdOrderByCreatedAtAsc(roomId);
        log.info("Found {} messages for roomId: {}", messages.size(), roomId);
        return messages.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public MessageResponse createMessage(CreateMessageRequest request, UUID userId) {
        log.info("Creating message for roomId: {}, userId: {}", request.getRoomId(), userId);
        
        Message message = new Message();
        message.setUserId(userId);
        message.setRoomId(request.getRoomId());
        message.setMessage(request.getMessage());

        Message savedMessage = messageRepository.save(message);
        log.info("Message created successfully with id: {}", savedMessage.getId());
        
        return toResponse(savedMessage);
    }

    private MessageResponse toResponse(Message message) {
        String userEmail = userRepository.findById(message.getUserId())
                .map(User::getEmail)
                .orElse(message.getUserId().toString());

        return new MessageResponse(
                message.getId(),
                userEmail,
                message.getRoomId(),
                message.getMessage(),
                message.getCreatedAt()
        );
    }
}

