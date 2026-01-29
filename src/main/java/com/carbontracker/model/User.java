package com.carbontracker.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private UserType userType;
    private LocalDateTime createdAt;
    private int streakCount;
    private LocalDate lastLogDate;

    public User() {}

    public User(String id, String name, String email, String password, UserType userType, LocalDateTime createdAt, int streakCount, LocalDate lastLogDate) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.userType = userType;
        this.createdAt = createdAt;
        this.streakCount = streakCount;
        this.lastLogDate = lastLogDate;
    }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public UserType getUserType() { return userType; }
    public void setUserType(UserType userType) { this.userType = userType; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public int getStreakCount() { return streakCount; }
    public void setStreakCount(int streakCount) { this.streakCount = streakCount; }
    public LocalDate getLastLogDate() { return lastLogDate; }
    public void setLastLogDate(LocalDate lastLogDate) { this.lastLogDate = lastLogDate; }

    public static class UserBuilder {
        private String id;
        private String name;
        private String email;
        private String password;
        private UserType userType;
        private LocalDateTime createdAt;
        private int streakCount;
        private LocalDate lastLogDate;

        public UserBuilder id(String id) { this.id = id; return this; }
        public UserBuilder name(String name) { this.name = name; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder password(String password) { this.password = password; return this; }
        public UserBuilder userType(UserType userType) { this.userType = userType; return this; }
        public UserBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public UserBuilder streakCount(int streakCount) { this.streakCount = streakCount; return this; }
        public UserBuilder lastLogDate(LocalDate lastLogDate) { this.lastLogDate = lastLogDate; return this; }
        public User build() {
            return new User(id, name, email, password, userType, createdAt, streakCount, lastLogDate);
        }
    }
}
