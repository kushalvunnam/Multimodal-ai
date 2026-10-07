# OmniSense AI

**"An explainable multimodal AI platform that connects image, document, voice and text evidence to identify correlations, contradictions and actionable insights."**

---

## 🚀 Live Demo

**Try OmniSense AI:** https://celadon-mooncake-332a11.netlify.app/

**Source Code:** https://github.com/kushalvunnam/Multimodal-ai

---

## What it does
OmniSense AI is an advanced multimodal intelligence platform designed to parse disparate data formats—images, PDFs, audio recordings, and text—into a single, cohesive reasoning engine. It cross-references facts across all modalities to automatically detect consistent findings, flag potential contradictions, identify missing information, and generate actionable next steps.

## Problem
In insurance claims, compliance, and investigation workflows, reviewers manually cross-reference evidence across multiple disconnected formats. A damaged car photo, a police report PDF, and a voice statement from a claimant are processed in silos. This leads to missed discrepancies, high processing times, and increased fraud risk. Standard LLMs can analyze text, but they struggle to deterministically cross-verify facts across separate modal sources without hallucinating.

## Solution
OmniSense AI solves this by introducing a **Cross-Modal Reasoning Engine**. It independently processes each uploaded modality using native multimodal models, normalizes the findings into a strict schema, and then synthesizes them. It does not just summarize; it mathematically maps evidence to show *why* a contradiction exists or *how* a fact is corroborated, producing a highly explainable Intelligence Report.

## Key Features
- **Multimodal Ingestion**: Drag-and-drop support for Images, Documents, Audio, and Text.
- **Cross-Modal Reasoning**: Identifies correlations and contradictions across disparate file types.
- **Explainable Evidence Explorer**: Every AI conclusion traces back to the exact source file and evidence snippet.
- **Ask OmniSense**: A context-aware chat assistant that can explain reasoning based *only* on the extracted evidence.
- **Customer Summary Generation**: Translates complex cross-modal findings into simple, jargon-free explanations.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS v4, Framer Motion, React Three Fiber (3D UI)
- **Backend**: Node.js, Express, Multer (Memory Storage)
- **AI Engine**: Google Gemini API (`@google/generative-ai`), strict JSON normalization
- **Architecture**: Provider-agnostic abstraction layer for simple swapping of LLMs (Gemini, Groq)

## Architecture
1. **Upload Pipeline**: Files are caught by Express/Multer and mapped into isolated memory buffers.
2. **Modality Processing**: Each file is sent to the AI Provider using native inline-data parsing (no OCR/STT middleware needed for supported models).
3. **Normalization**: Raw AI responses are sanitized and forced into deterministic JSON objects.
4. **Reasoning Engine**: Modality-specific objects are injected into a synthetic reasoning prompt to extract Correlations, Contradictions, and Risks.
5. **UI Binding**: The React frontend binds the JSON output to dynamic, color-coded visual chains with expandable evidence nodes.

## Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/kushalvunnam/Multimodal-ai.git
   cd Multimodal-ai
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   # Create a .env file with VITE_API_BASE_URL=http://localhost:5000
   npm run dev
   ```

## Environment Variables

**Backend (`backend/.env`)**:
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

**Frontend (`frontend/.env`)**:
```env
VITE_API_BASE_URL=http://localhost:5000
```

## Demo Flow
1. Navigate to **New Analysis**.
2. Click **"Load Demo Claim"** to automatically populate a simulated insurance claim (Image, Document, Audio).
3. Click **"Analyze with OmniSense"**.
4. Watch the 3D processing engine synthesize the inputs.
5. On the **Results** page, observe the explicit **Contradiction** (Date mismatch between Document and Voice) and the **Consistent Finding** (Front Bumper Damage across all sources).
6. Click **"View Evidence"** to see exactly how the AI came to its conclusion.

## Future Scope
- **Persistent Storage**: Migrating from InMemoryDB to MongoDB for long-term claim retention.
- **Cloud Storage**: Routing file uploads directly to AWS S3 / Cloudinary.
- **Enterprise Webhooks**: Automatically dispatching high-risk claim flags to external ticketing systems (Jira, ServiceNow).

---
*Built for the 2026 AI Hackathon.*
