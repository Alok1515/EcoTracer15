# 🌿 Carbon Tracker — Complete Design Diagrams

---

## 1. 🏗️ High-Level System Architecture

```mermaid
graph TB
    subgraph CLIENT["🖥️ Client (Browser)"]
        direction TB
        NX["Next.js 15 App\n(port 3000)"]
    end

    subgraph BACKEND["⚙️ Spring Boot 3.2 Backend (port 8080)"]
        direction TB
        SEC["🔐 Security Layer\nJwtAuthenticationFilter\n↓\nSpring SecurityFilterChain"]
        CTRL["📡 Controllers\nAuth · Activity · Emission\nUser · LCA · Chat"]
        SVC["🧠 Services\nAuthService · ActivityService\nLcaService · ChatService\nEmissionFactorService · UserService"]
        REPO["🗄️ Repositories\nUserRepository · ActivityRepository\nEmissionFactorRepository · LcaRepository"]
    end

    subgraph DB["🍃 MongoDB Database"]
        direction TB
        U[("users")]
        A[("activities")]
        EF[("emission_factors")]
        LF[("lca_factors")]
    end

    subgraph EXT["🤖 External Services"]
        OR["OpenRouter API\n(LLM Gateway → GPT-4 / Claude)"]
    end

    NX -->|"HTTP + Authorization: Bearer JWT"| SEC
    SEC --> CTRL
    CTRL --> SVC
    SVC --> REPO
    REPO --> U & A & EF & LF
    SVC -->|"WebClient (non-blocking)"| OR
    OR -->|"AI response"| SVC

    style CLIENT fill:#1a1a2e,color:#e0e0e0,stroke:#4a9eff
    style BACKEND fill:#0d1117,color:#e0e0e0,stroke:#3fb950
    style DB fill:#0d1117,color:#e0e0e0,stroke:#f0883e
    style EXT fill:#0d1117,color:#e0e0e0,stroke:#bc8cff
```

---

## 2. 🔐 JWT Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as Next.js Frontend
    participant Filter as JwtAuthenticationFilter
    participant Auth as AuthController
    participant AS as AuthService
    participant JU as JwtUtils
    participant DB as MongoDB (users)

    Note over User,DB: ── REGISTRATION / LOGIN ──

    User->>FE: Enter email + password
    FE->>Auth: POST /api/auth/login {email, password}
    Auth->>AS: login(request)
    AS->>DB: findByEmail(email)
    DB-->>AS: User document
    AS->>AS: BCryptPasswordEncoder.matches()
    AS->>JU: generateToken(userDetails)
    JU-->>AS: HS256 signed JWT
    AS-->>Auth: AuthResponse {token, user}
    Auth-->>FE: 200 OK + JWT token
    FE->>FE: localStorage.setItem("token", jwt)

    Note over User,DB: ── EVERY SUBSEQUENT REQUEST ──

    User->>FE: Access dashboard
    FE->>Filter: GET /api/emission/stats\nAuthorization: Bearer <token>
    Filter->>Filter: Extract token from header (substring(7))
    Filter->>JU: extractUsername(token)
    JU-->>Filter: email
    Filter->>DB: loadUserByUsername(email)
    DB-->>Filter: UserDetails
    Filter->>JU: validateToken(token, userDetails)
    JU-->>Filter: true ✓
    Filter->>Filter: Set Authentication in SecurityContextHolder
    Filter->>Auth: Forward to Controller
    Auth-->>FE: Protected response data
```

---

## 3. 🗄️ MongoDB Database Schema

```mermaid
erDiagram
    USERS {
        String id PK
        String name
        String email
        String password_bcrypt
        String userType
        LocalDateTime createdAt
        int streakCount
        LocalDate lastLogDate
    }

    ACTIVITIES {
        String id PK
        String userId FK
        ActivityType type
        Double value
        Double emission_kgCO2
        String description
        LocalDateTime date
    }

    EMISSION_FACTORS {
        String id PK
        ActivityType category
        Double co2PerUnit
    }

    LCA_FACTORS {
        String id PK
        LcaStage stage
        String name
        Double value
    }

    USERS ||--o{ ACTIVITIES : "has many"
    ACTIVITIES }o--|| EMISSION_FACTORS : "references"
```

**ActivityType enum (10 values):**
`TRAVEL · ELECTRICITY · FOOD · HEATING · FLIGHTS · PRODUCT · TREE_PLANTING · WASTE · WATER · SHOPPING`

**LcaStage enum (5 stages):**
`RAW_MATERIAL · MANUFACTURING · TRANSPORTATION · USAGE · END_OF_LIFE`

---

## 4. 📡 Complete REST API Map

```mermaid
graph LR
    subgraph AUTH["AuthController\n/api/auth"]
        A1["POST /register"]
        A2["POST /login"]
    end

    subgraph ACTIVITY["ActivityController\n/api/activity"]
        B1["POST /add"]
        B2["GET /user"]
    end

    subgraph EMISSION["EmissionController\n/api/emission"]
        C1["GET /today"]
        C2["GET /monthly"]
        C3["GET /stats"]
        C4["GET /leaderboard"]
    end

    subgraph LCA["LcaController\n/api/lca"]
        D1["POST /calculate\n(public - no auth)"]
    end

    subgraph CHAT["ChatController\n/api/chat"]
        E1["POST /"]
    end

    subgraph USER["UserController\n/api/user"]
        F1["PUT /profile"]
        F2["DELETE /account"]
    end

    subgraph NEXTJS["Next.js API Routes\n/api/..."]
        G1["POST /api/chat"]
        G2["POST /api/insights"]
    end

    A1 & A2 -->|"PUBLIC\n(no JWT needed)"| OPEN(("🔓 Open"))
    D1 --> OPEN
    B1 & B2 & C1 & C2 & C3 & C4 & E1 & F1 & F2 -->|"PROTECTED\n(JWT required)"| LOCK(("🔐 Auth"))

    style AUTH fill:#1e3a5f,color:#7dd3fc,stroke:#3b82f6
    style ACTIVITY fill:#1e4f3a,color:#6ee7b7,stroke:#10b981
    style EMISSION fill:#4f3a1e,color:#fcd34d,stroke:#f59e0b
    style LCA fill:#3a1e4f,color:#d8b4fe,stroke:#a855f7
    style CHAT fill:#4f1e1e,color:#fca5a5,stroke:#ef4444
    style USER fill:#1e4f4f,color:#67e8f9,stroke:#06b6d4
    style NEXTJS fill:#2d2d1e,color:#d9f99d,stroke:#84cc16
```

---

## 5. 🖥️ Frontend Component Tree

```mermaid
graph TD
    subgraph PAGES["📄 Next.js Pages (App Router)"]
        ROOT["/ (Landing Page)\npage.tsx"]
        LOGIN["/login\npage.tsx"]
        REG["/register\npage.tsx"]
        DASH["/dashboard\npage.tsx ← MAIN HUB"]
        LCA_PAGE["/dashboard/lca\npage.tsx"]
    end

    subgraph VIEWS["📦 Dashboard Views (Tab-based)"]
        OV["Overview Tab\n• Stat cards (5)\n• Quick Entry form\n• Recharts PieChart\n• Recharts LineChart\n• Activity history"]
        LB["Leaderboard Tab\nLeaderboard.tsx"]
        IN["Insights Tab\nInsights.tsx"]
        AI["AI Assistant Tab\nAIAssistant.tsx"]
        ST["Settings Tab\nSettings.tsx"]
    end

    subgraph CHARTS["📊 Recharts Components"]
        PIE["PieChart\n(emissions by category)"]
        LINE["LineChart\n(5-month CO2 timeline)"]
    end

    subgraph UI["🎨 Shadcn UI Primitives"]
        CARD["Card / CardContent"]
        TABS["Tabs / TabsList / TabsTrigger"]
        SEL["Select / SelectItem"]
        INPUT["Input / Textarea"]
        BTN["Button"]
        SWITCH["Switch (Precision Mode)"]
        DIALOG["Dialog / AlertDialog"]
        PROG["Progress"]
    end

    subgraph ANIMATION["✨ Framer Motion"]
        FM["motion.div\nAnimatePresence\nTab transitions\nStreak modal\nEmission preview"]
    end

    ROOT --> LOGIN & REG & DASH
    DASH --> OV & LB & IN & AI & ST
    DASH --> LCA_PAGE
    OV --> PIE & LINE
    OV & LB & IN & AI & ST --> UI
    DASH --> FM
```

---

## 6. 🔄 Emission Tracking Data Flow

```mermaid
flowchart TD
    U(["👤 User"])
    U -->|"1. Select category\ne.g. Transportation"| FE

    subgraph FE["🖥️ Next.js Dashboard"]
        INPUT["Category + Vehicle Type\n+ Value (km)"]
        PREVIEW["Real-time Preview\nvalue × factor = X kg CO2e\n(IPCC/EPA/DEFRA source shown)"]
        INPUT --> PREVIEW
    end

    FE -->|"2. POST /api/activity/add\n{type: TRAVEL, value: 50}"| FILTER

    subgraph SPRING["⚙️ Spring Boot"]
        FILTER["JwtAuthenticationFilter\n→ validates JWT\n→ sets SecurityContext"]
        AC["ActivityController\n.addActivity(dto)"]
        AS["ActivityService\n1. Get email from SecurityContext\n2. Load user from MongoDB\n3. Fetch emission factor\n4. emission = value × factor\n5. Save Activity document\n6. Update streak"]
        EFS["EmissionFactorService\n.getEmissionFactor(TRAVEL)\n→ looks up MongoDB\n→ returns 0.21 kg/km"]
    end

    FILTER --> AC --> AS
    AS <-->|"factor lookup"| EFS

    subgraph MONGO["🍃 MongoDB"]
        EF_DOC[("emission_factors\ncategory: TRAVEL\nco2PerUnit: 0.21")]
        ACT_DOC[("activities\nuserId: xyz\ntype: TRAVEL\nvalue: 50\nemission: 10.5 kg CO2\ndate: 2026-04-22")]
        USER_DOC[("users\nstreakCount: 5\nlastLogDate: 2026-04-22")]
    end

    EFS -->|"query"| EF_DOC
    AS -->|"save"| ACT_DOC
    AS -->|"update streak"| USER_DOC

    AS -->|"3. return ActivityResponseDTO\n{activity, isFirstToday, streakCount}"| FE

    FE -->|"4. fetch /api/emission/stats"| SPRING
    SPRING -->|"14 computed metrics"| FE

    FE -->|"5. Recharts renders\nPieChart + LineChart"| DASH_VIEW[/"📊 Live Dashboard"/]

    style FE fill:#1a1a2e,stroke:#4a9eff,color:#e0e0e0
    style SPRING fill:#0d1117,stroke:#3fb950,color:#e0e0e0
    style MONGO fill:#0d1117,stroke:#f0883e,color:#e0e0e0
```

---

## 7. 🌍 5-Stage LCA Calculation Engine

```mermaid
flowchart LR
    INPUT(["📦 User Input\n• Material type\n• Material kg\n• Energy kWh\n• Transport mode\n• Distance km\n• Usage kWh\n• Disposal type"])

    subgraph LCA_ENGINE["LcaService.calculateEmissions()"]
        direction TB
        S1["Stage 1: RAW_MATERIAL\nmaterialKg × factor(materialType)\ne.g. Steel = 1.85 kg CO2/kg"]
        S2["Stage 2: MANUFACTURING\nenergyKwh × electricityFactor\ne.g. 0.233 kg CO2/kWh"]
        S3["Stage 3: TRANSPORTATION\n(materialKg ÷ 1000) × distanceKm × transportFactor\n[converts kg → tons for ton-km]"]
        S4["Stage 4: USAGE\nusageKwh × electricityFactor"]
        S5["Stage 5: END_OF_LIFE\nmaterialKg × disposalFactor\ne.g. Landfill = 0.58 kg CO2/kg"]
        TOTAL["Σ Total = S1+S2+S3+S4+S5\nRounded to 2 decimal places"]
    end

    MONGO2[("🍃 lca_factors\ncollection\nIPCC/DEFRA data")]

    OUTPUT(["📊 LcaResponse\n• totalEmission (kg CO2)\n• unit: 'kg CO2'\n• breakdown {stage: value}"])

    INPUT --> LCA_ENGINE
    LCA_ENGINE <-->|"getFactorValue(stage, name)"| MONGO2
    S1 & S2 & S3 & S4 & S5 --> TOTAL --> OUTPUT

    style LCA_ENGINE fill:#1e1e3a,stroke:#a855f7,color:#e0e0e0
    style MONGO2 fill:#0d1117,stroke:#f0883e,color:#e0e0e0
```

---

## 8. 🤖 AI Sustainability Hub Call Chain

```mermaid
sequenceDiagram
    actor User
    participant FE as Next.js\n/api/chat route
    participant CC as ChatController\nPOST /api/chat
    participant CS as ChatService\n(Spring)
    participant WC as WebClient\n(Reactive/Non-blocking)
    participant OR as OpenRouter API\n(LLM Gateway)
    participant LLM as LLM Model\n(GPT-4 / Claude)

    User->>FE: Types message in AI Hub
    FE->>CC: POST /api/chat\n{messages: [...history]}
    CC->>CS: getChatResponse(request)

    Note over CS: Prepends system prompt:\n"You are a Carbon Assistant..."\n"Focus on Net Emissions"

    CS->>WC: Build OpenRouter request\n{model, messages, max_tokens: 2000}
    WC->>OR: POST with Bearer API key\nContent-Type: application/json
    OR->>LLM: Route to best available model
    LLM-->>OR: Generated response
    OR-->>WC: OpenRouterResponse {choices}
    WC-->>CS: choices[0].message.content
    CS-->>CC: ChatResponse {reply}
    CC-->>FE: 200 OK {reply: "..."}
    FE-->>User: Render AI message in chat UI
```

---

## 9. 📊 Dashboard Stats Computation (getDashboardStats)

```mermaid
graph TD
    MONGO_FETCH["Load from MongoDB\n• All activities for user\n• All users (for community stats)\n• All global activities (for rank)"]

    MONGO_FETCH --> CALC1 & CALC2 & CALC3 & CALC4 & CALC5 & CALC6 & CALC7

    CALC1["📅 Today's Emissions\nfilter date between\nLocalTime.MIN → MAX"]
    CALC2["📆 Monthly Emissions\nfilter from 1st of month\nto current date"]
    CALC3["📉 Monthly Change %\n(current - last) / last × 100"]
    CALC4["🌳 Trees Needed\nceil(totalPositiveEmissions / 21)\nminus treesAlreadyPlanted"]
    CALC5["🏆 Community Rank\nSort all users by net emission\nUser's position in sorted list"]
    CALC6["🔥 Streak Count\nCheck lastLogDate:\n• = today → keep\n• = yesterday → +1\n• else → reset to 0"]
    CALC7["📊 Timeline Data\nLast 5 months\nMonthly emission totals\nfor LineChart"]

    CALC1 & CALC2 & CALC3 & CALC4 & CALC5 & CALC6 & CALC7 --> DTO

    DTO["DashboardStatsDTO\n14 fields total\n↓\nJSON to frontend"]

    DTO --> CARDS["📦 4 Stat Cards\n(Net Balance, Lifetime,\nMonthly Change, Rank)"]
    DTO --> PIE2["🥧 PieChart\nemissions by category"]
    DTO --> LINE2["📈 LineChart\n5-month timeline"]
    DTO --> STREAK["🔥 Streak Badge\nin nav bar"]

    style CALC1 fill:#1e3a5f,stroke:#3b82f6,color:#e0e0e0
    style CALC2 fill:#1e4f3a,stroke:#10b981,color:#e0e0e0
    style CALC3 fill:#4f2d1e,stroke:#f59e0b,color:#e0e0e0
    style CALC4 fill:#2d4f1e,stroke:#84cc16,color:#e0e0e0
    style CALC5 fill:#4f1e4f,stroke:#a855f7,color:#e0e0e0
    style CALC6 fill:#4f2d1e,stroke:#ef4444,color:#e0e0e0
    style CALC7 fill:#1e4f4f,stroke:#06b6d4,color:#e0e0e0
```

---

## 10. 🏛️ Backend Package Structure (Class Diagram)

```mermaid
classDiagram
    class SecurityConfig {
        +JwtAuthenticationFilter jwtAuthFilter
        +SecurityFilterChain securityFilterChain()
        +BCryptPasswordEncoder passwordEncoder()
        +DaoAuthenticationProvider authProvider()
        --STATELESS session--
        --CORS: localhost:3000--
    }

    class JwtAuthenticationFilter {
        +JwtUtils jwtUtils
        +doFilterInternal(req, res, chain)
        --Extracts Bearer token--
        --Sets SecurityContext--
    }

    class JwtUtils {
        -String jwtSecret
        -int jwtExpirationMs
        +generateToken(UserDetails) String
        +validateToken(token, UserDetails) Boolean
        +extractUsername(token) String
        --HS256 HMAC signing--
    }

    class AuthController {
        +POST /register AuthResponse
        +POST /login AuthResponse
    }

    class ActivityController {
        +POST /add ActivityResponseDTO
        +GET /user List~Activity~
    }

    class EmissionController {
        +GET /today Double
        +GET /monthly Double
        +GET /stats DashboardStatsDTO
        +GET /leaderboard List~LeaderboardDTO~
    }

    class ActivityService {
        +addActivity(ActivityDTO) ActivityResponseDTO
        +getUserActivities() List~Activity~
        +getDashboardStats() DashboardStatsDTO
        +getLeaderboard() List~LeaderboardDTO~
        -updateUserStreak(User)
    }

    class LcaService {
        +calculateEmissions(LcaRequest) LcaResponse
        -getFactorValue(LcaStage, name) Double
        --5 formula stages--
        --IPCC/DEFRA factors--
    }

    class ChatService {
        -WebClient webClient
        -String systemPrompt
        +getChatResponse(ChatRequest) Mono~ChatResponse~
        --OpenRouter API--
        --max_tokens: 2000--
    }

    class User {
        +String id
        +String email
        +String password_bcrypt
        +int streakCount
        +LocalDate lastLogDate
    }

    class Activity {
        +String userId
        +ActivityType type
        +Double value
        +Double emission
        +LocalDateTime date
    }

    SecurityConfig --> JwtAuthenticationFilter
    JwtAuthenticationFilter --> JwtUtils
    AuthController --> ActivityService
    ActivityController --> ActivityService
    EmissionController --> ActivityService
    ActivityService --> User
    ActivityService --> Activity
    LcaService --> LcaRepository
    ChatService --> WebClient
```

---

> 💡 **How to use these diagrams in an interview:**
> - Diagram 1 → "Let me show you the bird's-eye view"
> - Diagram 2 → If asked "How does login work?"
> - Diagram 6 → If asked "Walk me through what happens when I log an activity"
> - Diagram 7 → If asked "Explain the LCA feature"
> - Diagram 9 → If asked "How do you compute dashboard metrics?"
