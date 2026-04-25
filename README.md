# OncoInbox / OncoFlow AI

Intelligent dashboard to organize clinical WhatsApp messages for oncologists, transforming chaos into structured care.

## 🚀 Features

- **Automated Triage**: Messages are classified by Gemini AI into categories (Clinical Complication, Approved Treatment, Pending Report, etc.).
- **ClickUp Style Dashboard**: A clean, sober, and professional interface for managing clinical tasks.
- **Patient Timeline**: Automatic association of messages to patients.
- **Urgency Detection**: Real-time extraction of symptoms like fever, dyspnea, or pain, flagging them as "Urgente".
- **Team Collaboration**: Shared inbox for physicians, nurses, secretaries, and pharmacists.

## 🛠 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons.
- **Animations**: Motion.
- **AI**: Google Gemini API.

## 📖 How it works

1. A message arrives via simulated "WhatsApp Webhook".
2. The **Classification Engine** (Gemini) parses the text.
3. A **Clinical Event** is created with structured data (symptoms, drugs, cycle).
4. A **Task** is assigned to the relevant professional (Doctor, Secretary, etc.).
5. The doctor reviews and resolves the case in the dashboard.

## 📄 Documentation

- [SPEC.md](./SPEC.md) - Technical specifications.
- [PRD.md](./PRD.md) - Product requirements.
