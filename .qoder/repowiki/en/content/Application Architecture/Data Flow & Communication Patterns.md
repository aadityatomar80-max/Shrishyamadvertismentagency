# Data Flow & Communication Patterns

<cite>
**Referenced Files in This Document**
- [app/layout.tsx](file://app/layout.tsx)
- [components/AuthContext.tsx](file://components/AuthContext.tsx)
- [components/ThemeContext.tsx](file://components/ThemeContext.tsx)
- [components/LanguageContext.tsx](file://components/LanguageContext.tsx)
- [components/Navbar.tsx](file://components/Navbar.tsx)
- [app/login/page.tsx](file://app/login/page.tsx)
- [app/dashboard/page.tsx](file://app/dashboard/page.tsx)
- [lib/prisma.ts](file://lib/prisma.ts)
- [lib/notifications.ts](file://lib/notifications.ts)
- [app/api/enquiries/route.ts](file://app/api/enquiries/route.ts)
- [app/api/orders/route.ts](file://app/api/orders/route.ts)
- [app/api/orders/[id]/route.ts](file://app/api/orders/[id]/route.ts)
- [app/api/partners/route.ts](file://app/api/partners/route.ts)
- [app/api/recommendations/route.ts](file://app/api/recommendations/route.ts)
- [package.json](file://package.json)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)
10. [Appendices](#appendices)

## Introduction
This document explains the data flow architecture of the Shree Shyam Agency Portal. It traces how user interactions in React components propagate through context providers, API routes, and database operations. It documents authentication state flow, theme and language state propagation, and how API responses update component state. It also outlines separation between frontend state management and backend persistence, common data flow patterns (form submissions, authentication, and administrative updates), error handling, loading states, and caching strategies.

## Project Structure
The application follows a Next.js App Router structure with a root layout that wires global providers for authentication, theme, and language. Pages under app render UI and orchestrate data operations via API routes. Backend connectivity is handled by Prisma, with a guard ensuring database availability.

```mermaid
graph TB
subgraph "Browser Runtime"
L["Root Layout<br/>app/layout.tsx"]
C1["AuthContext<br/>components/AuthContext.tsx"]
C2["LanguageContext<br/>components/LanguageContext.tsx"]
C3["ThemeContext<br/>components/ThemeContext.tsx"]
N["Navbar<br/>components/Navbar.tsx"]
P1["Login Page<br/>app/login/page.tsx"]
P2["Dashboard Page<br/>app/dashboard/page.tsx"]
end
subgraph "Server Runtime"
APIE["Enquiries API<br/>app/api/enquiries/route.ts"]
APIO["Orders API<br/>app/api/orders/route.ts"]
APID["Order Detail API<br/>app/api/orders/[id]/route.ts"]
APIP["Partners API<br/>app/api/partners/route.ts"]
APIR["Recommendations API<br/>app/api/recommendations/route.ts"]
PRISMA["Prisma Client<br/>lib/prisma.ts"]
end
L --> C1 --> C2 --> C3 --> N
N --> P1
N --> P2
P1 --> APIE
P1 --> APIP
P2 --> APIO
P2 --> APIP
P2 --> APIP
P2 --> APIP
P2 --> APIR
APIE --> PRISMA
APIO --> PRISMA
APID --> PRISMA
APIP --> PRISMA
APIR --> PRISMA
```

**Diagram sources**
- [app/layout.tsx:17-46](file://app/layout.tsx#L17-L46)
- [components/AuthContext.tsx:29-60](file://components/AuthContext.tsx#L29-L60)
- [components/LanguageContext.tsx:23-50](file://components/LanguageContext.tsx#L23-L50)
- [components/ThemeContext.tsx:14-27](file://components/ThemeContext.tsx#L14-L27)
- [components/Navbar.tsx:19-60](file://components/Navbar.tsx#L19-L60)
- [app/login/page.tsx:7-125](file://app/login/page.tsx#L7-L125)
- [app/dashboard/page.tsx:6-38](file://app/dashboard/page.tsx#L6-L38)
- [app/api/enquiries/route.ts:8-111](file://app/api/enquiries/route.ts#L8-L111)
- [app/api/orders/route.ts:10-129](file://app/api/orders/route.ts#L10-L129)
- [app/api/orders/[id]/route.ts:11-54](file://app/api/orders/[id]/route.ts#L11-L54)
- [app/api/partners/route.ts:10-174](file://app/api/partners/route.ts#L10-L174)
- [app/api/recommendations/route.ts:4-56](file://app/api/recommendations/route.ts#L4-L56)
- [lib/prisma.ts:1-22](file://lib/prisma.ts#L1-L22)

**Section sources**
- [app/layout.tsx:17-46](file://app/layout.tsx#L17-L46)
- [package.json:13-27](file://package.json#L13-L27)

## Core Components
- Authentication state: Managed in a client-side context provider with localStorage persistence for role and mobile. Exposes login/logout to update state and persist across sessions.
- Language state: Client-side context provider with localStorage persistence for language selection and a toggle function.
- Theme state: Client-side context provider that always uses a light theme; toggle is a no-op.
- Prisma client: Created conditionally when a database URL is present; otherwise, APIs fall back to in-memory storage for development.
- Notifications: Stubbed notification functions for partner applications, order confirmations, and status updates.

Key responsibilities:
- Frontend state management: Role, language, theme, and UI state live in React contexts and local storage.
- Backend data persistence: API routes write/read to/from the database via Prisma or in-memory arrays.

**Section sources**
- [components/AuthContext.tsx:14-70](file://components/AuthContext.tsx#L14-L70)
- [components/LanguageContext.tsx:14-59](file://components/LanguageContext.tsx#L14-L59)
- [components/ThemeContext.tsx:7-34](file://components/ThemeContext.tsx#L7-L34)
- [lib/prisma.ts:7-22](file://lib/prisma.ts#L7-L22)
- [lib/notifications.ts:6-28](file://lib/notifications.ts#L6-L28)

## Architecture Overview
The system separates frontend state from backend persistence:
- Frontend: React components consume context providers and manage UI state. LocalStorage persists small pieces of state (auth, language).
- Backend: API routes handle requests, validate payloads, and interact with Prisma. When DATABASE_URL is absent, routes use in-memory arrays for development.

```mermaid
sequenceDiagram
participant U as "User"
participant UI as "React Component"
participant Ctx as "Context Providers"
participant API as "Next API Route"
participant DB as "Prisma Client"
U->>UI : "User action (click/form submit)"
UI->>Ctx : "Read state / dispatch actions"
UI->>API : "Fetch/Submit data (HTTP)"
API->>DB : "Query/Create/Update"
DB-->>API : "Result"
API-->>UI : "JSON response"
UI->>Ctx : "Update state (e.g., auth)"
UI-->>U : "Render updated UI"
```

[No sources needed since this diagram shows conceptual workflow, not actual code structure]

## Detailed Component Analysis

### Authentication Flow: Login → Dashboard
This flow demonstrates how user interactions update authentication state and drive navigation.

```mermaid
sequenceDiagram
participant Browser as "Browser"
participant Login as "LoginPage<br/>app/login/page.tsx"
participant Auth as "AuthContext<br/>components/AuthContext.tsx"
participant Router as "Next Router"
participant Dash as "DashboardPage<br/>app/dashboard/page.tsx"
Browser->>Login : "Open /login"
Login->>Login : "Collect role and mobile"
Login->>Auth : "login({ role, mobile })"
Auth->>Auth : "Persist to localStorage"
Auth-->>Login : "State updated"
Login->>Router : "navigate('/dashboard')"
Router-->>Dash : "Render dashboard"
Dash->>Auth : "Read user role"
Dash-->>Browser : "Show role-specific UI"
```

**Diagram sources**
- [app/login/page.tsx:57-121](file://app/login/page.tsx#L57-L121)
- [components/AuthContext.tsx:29-60](file://components/AuthContext.tsx#L29-L60)
- [app/dashboard/page.tsx:6-38](file://app/dashboard/page.tsx#L6-L38)

**Section sources**
- [app/login/page.tsx:7-125](file://app/login/page.tsx#L7-L125)
- [components/AuthContext.tsx:29-60](file://components/AuthContext.tsx#L29-L60)
- [app/dashboard/page.tsx:6-38](file://app/dashboard/page.tsx#L6-L38)

### Form Submission Flow: Enquiries
This pattern shows validation, persistence, and response handling for client-submitted data.

```mermaid
sequenceDiagram
participant User as "User"
participant UI as "Enquiries Form"
participant API as "POST /api/enquiries"
participant DB as "Prisma Client"
User->>UI : "Submit enquiry"
UI->>API : "POST { name, mobile, location, requirement }"
API->>API : "Validate payload"
API->>DB : "Create enquiry"
DB-->>API : "Enquiry record"
API-->>UI : "JSON { success, message, enquiry }"
UI-->>User : "Success feedback"
```

**Diagram sources**
- [app/api/enquiries/route.ts:8-81](file://app/api/enquiries/route.ts#L8-L81)
- [lib/prisma.ts:10-16](file://lib/prisma.ts#L10-L16)

**Section sources**
- [app/api/enquiries/route.ts:8-111](file://app/api/enquiries/route.ts#L8-L111)
- [lib/prisma.ts:10-16](file://lib/prisma.ts#L10-L16)

### Order Lifecycle: Creation → Assignment → Status Update
This sequence covers creation, retrieval, and administrative updates to orders.

```mermaid
sequenceDiagram
participant Client as "Client"
participant API_C as "POST /api/orders"
participant DB as "Prisma Client"
Client->>API_C : "Create order {clientName, clientMobile, clientArea, serviceType, budget}"
API_C->>DB : "Insert order"
DB-->>API_C : "Order with publicId/status"
API_C-->>Client : "JSON { success, message, order }"
```

```mermaid
sequenceDiagram
participant Admin as "Admin"
participant API_G as "GET /api/orders"
participant DB as "Prisma Client"
Admin->>API_G : "List orders"
API_G->>DB : "FindMany orders with relations"
DB-->>API_G : "Orders array"
API_G-->>Admin : "JSON { orders }"
```

```mermaid
sequenceDiagram
participant Admin as "Admin"
participant API_U as "PATCH /api/orders/[id]"
participant DB as "Prisma Client"
Admin->>API_U : "Update { status, partnerId, teamBoyId }"
API_U->>DB : "Update order"
DB-->>API_U : "Updated order"
API_U-->>Admin : "JSON { order }"
```

**Diagram sources**
- [app/api/orders/route.ts:38-129](file://app/api/orders/route.ts#L38-L129)
- [app/api/orders/[id]/route.ts:11-54](file://app/api/orders/[id]/route.ts#L11-L54)
- [lib/prisma.ts:10-16](file://lib/prisma.ts#L10-L16)

**Section sources**
- [app/api/orders/route.ts:10-129](file://app/api/orders/route.ts#L10-L129)
- [app/api/orders/[id]/route.ts:11-54](file://app/api/orders/[id]/route.ts#L11-L54)
- [lib/prisma.ts:10-16](file://lib/prisma.ts#L10-L16)

### Partner Application Flow: Validation → User/Payment Profile Creation
This flow demonstrates validation, user existence checks, and creation of partner profiles.

```mermaid
sequenceDiagram
participant User as "User"
participant API as "POST /api/partners"
participant DB as "Prisma Client"
User->>API : "Apply { name, mobile, type, area }"
API->>API : "Validate fields and mobile"
API->>DB : "Find user by mobile"
alt "User exists"
API->>DB : "Check existing partner profile"
else "New user"
API->>DB : "Create user with role"
end
API->>DB : "Create partner profile"
DB-->>API : "User + Partner"
API-->>User : "JSON { success, message, partner }"
```

**Diagram sources**
- [app/api/partners/route.ts:43-174](file://app/api/partners/route.ts#L43-L174)
- [lib/prisma.ts:10-16](file://lib/prisma.ts#L10-L16)

**Section sources**
- [app/api/partners/route.ts:43-174](file://app/api/partners/route.ts#L43-L174)
- [lib/prisma.ts:10-16](file://lib/prisma.ts#L10-L16)

### Recommendation Engine Stub
A simple recommendation endpoint records a request and returns a generated suggestion.

```mermaid
sequenceDiagram
participant Client as "Client"
participant API as "POST /api/recommendations"
participant DB as "Prisma Client"
Client->>API : "POST { area, budget, goal }"
API->>API : "Validate payload"
API->>DB : "Create recommendation request"
DB-->>API : "Record with suggestion"
API-->>Client : "JSON { recommendation }"
```

**Diagram sources**
- [app/api/recommendations/route.ts:4-56](file://app/api/recommendations/route.ts#L4-L56)
- [lib/prisma.ts:10-16](file://lib/prisma.ts#L10-L16)

**Section sources**
- [app/api/recommendations/route.ts:4-56](file://app/api/recommendations/route.ts#L4-L56)
- [lib/prisma.ts:10-16](file://lib/prisma.ts#L10-L16)

### State Propagation: Theme and Language
Theme and language are provided globally and persisted locally. The Navbar reads current language/theme and renders localized links.

```mermaid
flowchart TD
Start(["App Starts"]) --> Providers["ThemeProvider + LanguageProvider + AuthProvider<br/>app/layout.tsx"]
Providers --> Navbar["Navbar reads lang/theme<br/>components/Navbar.tsx"]
Navbar --> UI["Render localized links"]
UI --> Persist["Persist lang to localStorage<br/>components/LanguageContext.tsx"]
UI --> Toggle["Toggle theme/lang buttons<br/>components/Navbar.tsx"]
Toggle --> Update["Update context state"]
Update --> Persist
```

**Diagram sources**
- [app/layout.tsx:24-42](file://app/layout.tsx#L24-L42)
- [components/ThemeContext.tsx:14-27](file://components/ThemeContext.tsx#L14-L27)
- [components/LanguageContext.tsx:23-50](file://components/LanguageContext.tsx#L23-L50)
- [components/Navbar.tsx:19-60](file://components/Navbar.tsx#L19-L60)

**Section sources**
- [app/layout.tsx:24-42](file://app/layout.tsx#L24-L42)
- [components/ThemeContext.tsx:14-27](file://components/ThemeContext.tsx#L14-L27)
- [components/LanguageContext.tsx:23-50](file://components/LanguageContext.tsx#L23-L50)
- [components/Navbar.tsx:19-60](file://components/Navbar.tsx#L19-L60)

## Dependency Analysis
- Context providers depend on React’s Context API and localStorage for persistence.
- API routes depend on Prisma client initialization guarded by DATABASE_URL.
- Notifications module is decoupled and intended for future integration with external services.

```mermaid
graph LR
Auth["AuthContext.tsx"] --> LocalStorage["localStorage"]
Lang["LanguageContext.tsx"] --> LocalStorage
Theme["ThemeContext.tsx"] --> UI["UI Rendering"]
Login["login/page.tsx"] --> Auth
Dash["dashboard/page.tsx"] --> Auth
APIE["api/enquiries/route.ts"] --> Prisma["lib/prisma.ts"]
APIO["api/orders/route.ts"] --> Prisma
APID["api/orders/[id]/route.ts"] --> Prisma
APIP["api/partners/route.ts"] --> Prisma
APIR["api/recommendations/route.ts"] --> Prisma
Notif["lib/notifications.ts"] -.-> APIE
Notif -.-> APIO
```

**Diagram sources**
- [components/AuthContext.tsx:29-60](file://components/AuthContext.tsx#L29-L60)
- [components/LanguageContext.tsx:23-50](file://components/LanguageContext.tsx#L23-L50)
- [components/ThemeContext.tsx:14-27](file://components/ThemeContext.tsx#L14-L27)
- [app/login/page.tsx:7-125](file://app/login/page.tsx#L7-L125)
- [app/dashboard/page.tsx:6-38](file://app/dashboard/page.tsx#L6-L38)
- [app/api/enquiries/route.ts:8-111](file://app/api/enquiries/route.ts#L8-L111)
- [app/api/orders/route.ts:10-129](file://app/api/orders/route.ts#L10-L129)
- [app/api/orders/[id]/route.ts:11-54](file://app/api/orders/[id]/route.ts#L11-L54)
- [app/api/partners/route.ts:10-174](file://app/api/partners/route.ts#L10-L174)
- [app/api/recommendations/route.ts:4-56](file://app/api/recommendations/route.ts#L4-L56)
- [lib/prisma.ts:10-16](file://lib/prisma.ts#L10-L16)
- [lib/notifications.ts:6-28](file://lib/notifications.ts#L6-L28)

**Section sources**
- [components/AuthContext.tsx:29-60](file://components/AuthContext.tsx#L29-L60)
- [components/LanguageContext.tsx:23-50](file://components/LanguageContext.tsx#L23-L50)
- [components/ThemeContext.tsx:14-27](file://components/ThemeContext.tsx#L14-L27)
- [app/api/enquiries/route.ts:8-111](file://app/api/enquiries/route.ts#L8-L111)
- [app/api/orders/route.ts:10-129](file://app/api/orders/route.ts#L10-L129)
- [app/api/orders/[id]/route.ts:11-54](file://app/api/orders/[id]/route.ts#L11-L54)
- [app/api/partners/route.ts:10-174](file://app/api/partners/route.ts#L10-L174)
- [app/api/recommendations/route.ts:4-56](file://app/api/recommendations/route.ts#L4-L56)
- [lib/prisma.ts:10-16](file://lib/prisma.ts#L10-L16)
- [lib/notifications.ts:6-28](file://lib/notifications.ts#L6-L28)

## Performance Considerations
- Conditional Prisma client creation: The client is only instantiated when DATABASE_URL is present, avoiding unnecessary overhead in environments without a database.
- In-memory fallback: API routes use in-memory arrays during development, reducing database round-trips for local testing.
- Context memoization: Context values are memoized to prevent unnecessary re-renders.
- LocalStorage persistence: Reduces server calls for small UI state (auth, language), but avoid storing sensitive data beyond non-secret identifiers.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and remedies:
- Missing DATABASE_URL:
  - Symptom: API routes fall back to in-memory storage; database operations are not persisted.
  - Action: Set DATABASE_URL and redeploy; Prisma client will initialize normally.
- Invalid JSON payloads:
  - Symptom: API routes return 400 for malformed JSON.
  - Action: Validate request bodies before sending; ensure Content-Type is application/json.
- Validation failures:
  - Enquiries: Missing fields or invalid mobile number cause 400 responses.
  - Orders: Missing required fields or invalid service type cause 400 responses.
  - Partners: Missing fields, invalid mobile, or invalid partner type cause 400 responses.
- Order not found:
  - Symptom: GET /api/orders/[id] returns 404.
  - Action: Ensure the order ID exists and is correctly passed.
- Notification stubs:
  - Symptom: No emails/SMS sent.
  - Action: Integrate real providers in lib/notifications.ts.

**Section sources**
- [lib/prisma.ts:7-22](file://lib/prisma.ts#L7-L22)
- [app/api/enquiries/route.ts:15-30](file://app/api/enquiries/route.ts#L15-L30)
- [app/api/orders/route.ts:43-65](file://app/api/orders/route.ts#L43-L65)
- [app/api/orders/[id]/route.ts:22-24](file://app/api/orders/[id]/route.ts#L22-L24)
- [app/api/partners/route.ts:48-73](file://app/api/partners/route.ts#L48-L73)
- [lib/notifications.ts:6-28](file://lib/notifications.ts#L6-L28)

## Conclusion
The Shree Shyam Agency Portal cleanly separates frontend state management (contexts and localStorage) from backend persistence (Prisma). API routes encapsulate validation, persistence, and response formatting, enabling predictable data flows for forms, authentication, and administrative updates. The architecture supports development flexibility via in-memory fallbacks while maintaining a clear path to production-grade database operations and integrations.

## Appendices

### Data Flow Patterns Reference
- Form Submissions:
  - Enquiries: Validate fields and mobile; persist to DB or in-memory; return success payload.
  - Orders: Validate service type and fields; persist order; return minimal success payload.
  - Partners: Validate fields/mobile/type; upsert user and create partner profile; return success payload.
- Authentication:
  - Login page collects role and mobile; context login persists state; navigate to dashboard.
- Administrative Updates:
  - List orders; fetch order details; patch order status and assignees.
- Recommendations:
  - Validate payload; create request record; return suggestion.

[No sources needed since this section summarizes previously analyzed patterns]