

# 🤖 **Meet Rasheedah — Your AI Reservation Assistant**

**Rasheedah** is an Arabic female name symbolizing **reliability, intelligence, and wisdom** — perfectly reflecting her role in this system.

She adapts her capabilities based on your available setup and can operate in multiple modes.

## 🌟 **Modes of Operation**

### 🟢 **Level 3 — Full AI Mode**

**(WhatsApp API + OpenAI API)**

When both integrations are enabled, Rasheedah becomes a fully autonomous conversational assistant:

* Understands natural language
* Collects missing reservation details
* Routes intents to the right service
* Keeps conversation memory per user
* Responds instantly through WhatsApp

> **This is the most advanced mode, offering a human-like experience.**



### 🟡 **Level 2 — Smart Terminal Mode**

**(OpenAI Only)**

If WhatsApp is not configured but OpenAI is available, Rasheedah runs locally in your terminal with full intelligence:

* Human-like conversations
* Polite, friendly responses
* Context-aware dialog
* Full intent-routing logic

> Ideal for development, demos, and testing.



### 🔴 **Level 1 — Basic Terminal Mode**

**(No WhatsApp, No OpenAI)**

If no external integrations are available, Rasheedah gracefully falls back to a simple CLI interface:

```
1. Create reservation
2. Get reservation
3. Update reservation
4. Cancel reservation
5. Exit
```

> Ensures the system always works, even offline.



# 🚀 **Installation Guide**

Rasheedah automatically detects her operating mode based on your environment variables.
You only ever run **one command**:

```bash
npm run start
```

Depending on the ENV configuration, she will choose:

* 🟢 **WhatsApp Smart Mode** → if WhatsApp & OpenAI keys exist
* 🟡 **Smart Terminal Mode** → if only OpenAI key exists
* 🔴 **Basic Terminal Mode** → if neither OpenAI nor WhatsApp keys exist



## 📦 **1. Clone the Repository**

```bash
git clone https://github.com/jenanzakarneh/chatbot-demo.git
cd chatbot-demo
```



## 📚 **2. Install Dependencies**

```bash
npm install
```



## 🔧 **3. Create `.env` File**

Create a `.env` file in the root directory:

```bash
touch .env
```

Paste the template below:

```env
# ==========================
# GENERAL
# ==========================
PORT=3000

# ==========================
# OPENAI (for Smart Modes)
# ==========================
OPENAI_API_KEY=your_openai_key
OPEN_AI_MODEL=gpt-4o

# ==========================
# WHATSAPP CLOUD API (optional)
# ==========================
WHATSAPP_CLOUD_API_VERSION=v20.0
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_CLOUD_API_TEMPORARY_ACCESS_TOKEN=your_temp_access_token
WHATSAPP_CLOUD_API_WEBHOOK_VERIFICATION_TOKEN=your_webhook_verify_token
```



# 🔗 **Helpful Setup Links (Table Format)**

| Purpose                            | Link                                                                                                                                                 |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Generate OpenAI API Key**        | [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)                                                         |
| **OpenAI Documentation**           | [https://platform.openai.com/docs/overview](https://platform.openai.com/docs/overview)                                                               |
| **Download Ngrok**                 | [https://ngrok.com/download](https://ngrok.com/download)                                                                                             |
| **Ngrok Quickstart Guide**         | [https://ngrok.com/docs/getting-started/](https://ngrok.com/docs/getting-started/)                                                                   |
| **WhatsApp Cloud API Setup Guide** | [https://developers.facebook.com/docs/whatsapp/cloud-api/get-started](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)           |
| **WhatsApp Webhooks Guide**        | [https://developers.facebook.com/docs/graph-api/webhooks/getting-started/](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/) |



## ▶️ **4. Run Rasheedah**

Same command for all modes:

```bash
npm run start
```

Rasheedah will announce which mode she picks:

**WhatsApp Mode:**

```
Rasheedah is running in Smart WhatsApp Mode ✨
```

**Smart Terminal Mode:**

```
Running in Smart Terminal Mode 🧠
```

**Basic Mode:**

```
Running in Basic Terminal Mode 🟣
```



