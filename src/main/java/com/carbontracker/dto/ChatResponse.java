package com.carbontracker.dto;

public class ChatResponse {
    private String text;
    private String error;

    public ChatResponse() {}
    public ChatResponse(String text) {
        this.text = text;
    }
    public ChatResponse(String text, String error) {
        this.text = text;
        this.error = error;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
