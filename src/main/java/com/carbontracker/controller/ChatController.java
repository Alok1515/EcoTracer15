package com.carbontracker.controller;

import com.carbontracker.dto.ChatRequest;
import com.carbontracker.dto.ChatResponse;
import com.carbontracker.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public Mono<ChatResponse> chat(@RequestBody ChatRequest request) {
        return chatService.getChatResponse(request);
    }
}
