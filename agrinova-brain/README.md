# AgriNova Brain

A team assistant prototype for a fictional precision-farming company. It reads what the team already writes (emails, Slack, tickets, documents), prepares a morning brief for each person, answers questions with citations, and only proposes actions that a person approves.

Built for Agenthon Torino.

Live demo: https://agrinova-brain-887343251821.europe-west1.run.app

## What it shows

- **Morning brief.** Built before anyone asks, written for each role (product, tech, finance, sales, procurement, CEO). A simulated live incident sends each role its own alert.
- **Ask.** Answers come only from approved memory, documents and tasks the person is allowed to read. Every answer line carries a source. When nothing matches, it says "I don't know".
- **Permissions by role.** Restricted sources are removed before retrieval, so a blocked answer looks the same as a real gap and nothing leaks.
- **Shared memory.** Facts learned from emails and chats wait for a person to approve or reject them. Only approved items can answer questions.
- **Actions.** The assistant drafts; a person approves, edits or discards. Nothing is sent without a click.
- **Prompt-injection guard.** An email that tries to give orders to the assistant is quarantined and treated as data.

## How the AI is used

Answers are first assembled by rules from the sources a person may read. If "AI phrasing" is on, Gemini on Vertex AI rewrites the answer from those same sources only. The page then checks that every line cites a source the person is allowed to read, and drops anything that does not. If the model is unavailable, the rule-based answer is used.

## Stack

- Single-page app in plain HTML, CSS and JavaScript (`public/index.html`)
- Node.js and Express (`server.js`) serving the page and one endpoint, `/api/phrase`
- Gemini through Vertex AI with the `@google/genai` SDK
- Google Cloud Run for hosting

All company data in the demo is fictional.

## Run it locally

You need Node.js 20 or later, the Google Cloud CLI, and a Google Cloud project with billing and the Vertex AI API enabled.

```bash
gcloud auth application-default login
npm install
export GOOGLE_CLOUD_PROJECT=your-project-id
export GOOGLE_CLOUD_LOCATION=global
npm start
```

Open http://localhost:8080. No API key is needed: the server uses your Google Cloud credentials. Set `MODEL` to change the Gemini model (default `gemini-3.5-flash-lite`).

## Deploy to Cloud Run

```bash
gcloud run deploy agrinova-brain --source . --region europe-west1 \
  --set-env-vars GOOGLE_CLOUD_PROJECT=your-project-id,GOOGLE_CLOUD_LOCATION=global \
  --max-instances 1
```

The Cloud Run service account needs the `roles/aiplatform.user` role.

## Limits of the prototype

Source data, permissions and the citation check run in the browser. A production version would keep sources and access rules on the server and run the citation check there.
