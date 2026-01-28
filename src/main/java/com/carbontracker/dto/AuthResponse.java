package com.carbontracker.dto;

public class AuthResponse {
    private String token;
    private String name;
    private String email;

    public AuthResponse() {}

    public AuthResponse(String token, String name, String email) {
        this.token = token;
        this.name = name;
        this.email = email;
    }

    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public static class AuthResponseBuilder {
        private String token;
        private String name;
        private String email;

        public AuthResponseBuilder token(String token) { this.token = token; return this; }
        public AuthResponseBuilder name(String name) { this.name = name; return this; }
        public AuthResponseBuilder email(String email) { this.email = email; return this; }
        public AuthResponse build() {
            return new AuthResponse(token, name, email);
        }
    }
}
