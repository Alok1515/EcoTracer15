package com.carbontracker.service;

import com.carbontracker.dto.ChatRequest;
import com.carbontracker.dto.ChatResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChatService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final WebClient webClient;

    private final String systemPrompt = "You are a Carbon Assistant, an AI specialized in helping users reduce their carbon footprint and live more sustainably.\n" +
            "Your goals:\n" +
            "1. Provide personalized tips for reducing CO2 emissions.\n" +
            "2. Analyze emission data (if provided).\n" +
            "3. Suggest sustainable alternatives for travel, home energy, and food.\n" +
            "4. Be encouraging, informative, and professional.\n\n" +
            "Keep your responses concise but helpful. Use markdown for better readability.";

    public ChatService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public Mono<ChatResponse> getChatResponse(ChatRequest request) {
        List<ChatRequest.ChatMessage> messages = request.getMessages();
        if (messages == null || messages.isEmpty()) {
            return Mono.just(new ChatResponse(null, "No messages provided"));
        }

        // Format history for Gemini
        List<GeminiContent> contents = new ArrayList<>();
        
        // Gemini history must start with user
        List<ChatRequest.ChatMessage> history = messages.subList(0, messages.size() - 1);
        int startIdx = 0;
        while (startIdx < history.size() && !"user".equals(history.get(startIdx).getRole())) {
            startIdx++;
        }

        for (int i = startIdx; i < history.size(); i++) {
            ChatRequest.ChatMessage m = history.get(i);
            contents.add(new GeminiContent(
                "assistant".equals(m.getRole()) ? "model" : "user",
                List.of(new GeminiPart(m.getContent()))
            ));
        }

        // Current prompt combining system prompt and user message
        String userMessage = messages.get(messages.size() - 1).getContent();
        String fullPrompt = systemPrompt + "\n\nUser: " + userMessage;
        
        contents.add(new GeminiContent("user", List.of(new GeminiPart(fullPrompt))));

        GeminiRequest geminiRequest = new GeminiRequest(contents);

        return webClient.post()
                .uri(apiUrl + "?key=" + apiKey)
                .bodyValue(geminiRequest)
                .retrieve()
                .bodyToMono(GeminiResponse.class)
                .map(res -> {
                    if (res.getCandidates() != null && !res.getCandidates().isEmpty()) {
                        String text = res.getCandidates().get(0).getContent().getParts().get(0).getText();
                        return new ChatResponse(text);
                    }
                    return new ChatResponse(null, "Failed to get AI response");
                })
                .onErrorResume(e -> Mono.just(new ChatResponse(null, "Error: " + e.getMessage())));
    }

    // Gemini API Request/Response Models (Manual implementation without Lombok)
    public static class GeminiRequest {
        private List<GeminiContent> contents;
        private GenerationConfig generationConfig = new GenerationConfig();

        public GeminiRequest() {}
        public GeminiRequest(List<GeminiContent> contents) {
            this.contents = contents;
        }

        public List<GeminiContent> getContents() { return contents; }
        public void setContents(List<GeminiContent> contents) { this.contents = contents; }
        public GenerationConfig getGenerationConfig() { return generationConfig; }
        public void setGenerationConfig(GenerationConfig generationConfig) { this.generationConfig = generationConfig; }
    }

    public static class GenerationConfig {
        private int maxOutputTokens = 1000;
        public GenerationConfig() {}
        public int getMaxOutputTokens() { return maxOutputTokens; }
        public void setMaxOutputTokens(int maxOutputTokens) { this.maxOutputTokens = maxOutputTokens; }
    }

    public static class GeminiContent {
        private String role;
        private List<GeminiPart> parts;

        public GeminiContent() {}
        public GeminiContent(String role, List<GeminiPart> parts) {
            this.role = role;
            this.parts = parts;
        }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public List<GeminiPart> getParts() { return parts; }
        public void setParts(List<GeminiPart> parts) { this.parts = parts; }
    }

    public static class GeminiPart {
        private String text;
        public GeminiPart() {}
        public GeminiPart(String text) { this.text = text; }
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
    }

    public static class GeminiResponse {
        private List<Candidate> candidates;
        public GeminiResponse() {}
        public List<Candidate> getCandidates() { return candidates; }
        public void setCandidates(List<Candidate> candidates) { this.candidates = candidates; }

        public static class Candidate {
            private GeminiContent content;
            public Candidate() {}
            public GeminiContent getContent() { return content; }
            public void setContent(GeminiContent content) { this.content = content; }
        }
    }
}
