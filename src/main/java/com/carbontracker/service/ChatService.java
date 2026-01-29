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

    @Value("${openrouter.api.key}")
    private String apiKey;

    @Value("${openrouter.api.url}")
    private String apiUrl;

    @Value("${openrouter.api.model}")
    private String apiModel;

    private final WebClient webClient;

    private final String systemPrompt = "You are a Carbon Assistant, an AI specialized in helping users reduce their carbon footprint and live more sustainably.\n" +
            "Your goals:\n" +
            "1. Provide personalized tips for reducing CO2 emissions.\n" +
            "2. Analyze emission data (if provided). ALWAYS prioritize 'Net Emissions' (Total - Offsets) as the key metric.\n" +
            "3. Suggest sustainable alternatives for travel, home energy, and food.\n" +
            "4. Be encouraging, informative, and professional.\n\n" +
            "CRITICAL: Do not emphasize lifetime emissions. Focus exclusively on the Net Emissions balance to provide context for your advice.\n" +
            "Keep your responses concise but helpful. Use markdown for better readability.";

    public ChatService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public Mono<ChatResponse> getChatResponse(ChatRequest request) {
        List<ChatRequest.ChatMessage> messages = request.getMessages();
        if (messages == null || messages.isEmpty()) {
            return Mono.just(new ChatResponse(null, "No messages provided"));
        }

        // Format history for OpenRouter (OpenAI compatible)
        List<OpenRouterMessage> orMessages = new ArrayList<>();
        orMessages.add(new OpenRouterMessage("system", systemPrompt));
        
        for (ChatRequest.ChatMessage m : messages) {
            orMessages.add(new OpenRouterMessage(m.getRole(), m.getContent()));
        }

        OpenRouterRequest orRequest = new OpenRouterRequest(apiModel, orMessages);
        orRequest.setMax_tokens(2000); // Prevent credit issues by limiting response length

        return webClient.post()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(orRequest)
                .retrieve()
                .bodyToMono(OpenRouterResponse.class)
                .map(res -> {
                    if (res.getChoices() != null && !res.getChoices().isEmpty()) {
                        String text = res.getChoices().get(0).getMessage().getContent();
                        return new ChatResponse(text);
                    }
                    return new ChatResponse(null, "Failed to get AI response");
                })
                .onErrorResume(e -> Mono.just(new ChatResponse(null, "Error: " + e.getMessage())));
    }

    // OpenRouter (OpenAI compatible) API Models
    public static class OpenRouterRequest {
        private String model;
        private List<OpenRouterMessage> messages;
        private Integer max_tokens;

        public OpenRouterRequest() {}
        public OpenRouterRequest(String model, List<OpenRouterMessage> messages) {
            this.model = model;
            this.messages = messages;
        }

        public String getModel() { return model; }
        public void setModel(String model) { this.model = model; }
        public List<OpenRouterMessage> getMessages() { return messages; }
        public void setMessages(List<OpenRouterMessage> messages) { this.messages = messages; }
        public Integer getMax_tokens() { return max_tokens; }
        public void setMax_tokens(Integer max_tokens) { this.max_tokens = max_tokens; }
    }

    public static class OpenRouterMessage {
        private String role;
        private String content;

        public OpenRouterMessage() {}
        public OpenRouterMessage(String role, String content) {
            this.role = role;
            this.content = content;
        }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    public static class OpenRouterResponse {
        private List<Choice> choices;

        public OpenRouterResponse() {}
        public List<Choice> getChoices() { return choices; }
        public void setChoices(List<Choice> choices) { this.choices = choices; }

        public static class Choice {
            private OpenRouterMessage message;
            public Choice() {}
            public OpenRouterMessage getMessage() { return message; }
            public void setMessage(OpenRouterMessage message) { this.message = message; }
        }
    }
}
