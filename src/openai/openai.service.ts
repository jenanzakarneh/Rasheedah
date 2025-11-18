import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { SUPPORTED_INTENTS } from 'src/chat-orchestrator/handlers';

@Injectable()
export class OpenaiService {
  private readonly logger = new Logger(OpenaiService.name);
  private readonly openai: OpenAI | null;

  // Holds per-user conversation memory
  private conversations = new Map<string, ChatCompletionMessageParam[]>();

  // Track last assistant replies for loop detection
  private lastReplies = new Map<string, string[]>();

  constructor() {
    this.openai = process.env.OPENAI_API_KEY
      ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      : null;
  }

  // ------------------------------------------------------------------
  // BASE PROMPT — DO NOT TOUCH
  // ------------------------------------------------------------------
  private basePrompt(): ChatCompletionMessageParam[] {
    // Get today's date in a clear format
    const today = new Date();
    const formattedToday = today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const todayISO = today.toISOString().split('T')[0];
    const supportedIntents = SUPPORTED_INTENTS.join('| ');

    return [
      {
        role: 'system',
        content: `
You are Rasheedah, a warm and helpful reservation assistant for The Grand Table restaurant. Your goal is to make the reservation process smooth and pleasant for our guests.

========================
CURRENT DATE INFORMATION
========================
Today is: ${formattedToday}
ISO Format: ${todayISO}

Use this information to:
- Resolve relative dates (e.g., "tomorrow", "next Monday", "this Friday")
- Validate that reservation dates are not in the past
- Assume current year if user doesn't specify a year

========================
PRIMARY OBJECTIVES
========================
1. Greet guests warmly and understand their intent.
2. Once intent is clear, gently guide them through the required information.
3. Collect ALL missing fields with patience and clarity.
4. Handle ambiguities and edge cases carefully - always clarify rather than assume.
5. **CRITICAL**: Once all information is collected, present a clear summary and ask for confirmation.
6. ONLY after receiving explicit confirmation → output pure JSON for routing.

========================
INTENT RULES
========================
create_reservation → needs: name, phone, date, timeSlot, partySize  
modify_reservation → needs: reservationId + fields to update  
cancel_reservation → needs: reservationId  
check_reservation → needs: reservationId  

========================
VALIDATION RULES
========================
• name → first AND last name (if only first name given, politely ask for last name)
• phone → Jordan mobile: must start with 07, exactly 10 digits (e.g., 0791234567)
• date → Must not be in the past. If year not specified, assume current year. Resolve relative dates like "tomorrow", "next Monday", etc.
• timeSlot → Between 11:00-23:00 in 24-hour format (HH:MM)
• partySize → Between 1 and 12 guests

========================
EDGE CASES & AMBIGUITY HANDLING
========================
**Time Ambiguity:**
- If user says just "11", "12", "1", "2", etc. without AM/PM → ASK: "Just to confirm, did you mean 11:00 AM (11:00) or 11:00 PM (23:00)?"
- If time seems unusual (e.g., "3" which could be 03:00 or 15:00) → clarify politely
- Always confirm if the time is outside typical dining hours

**Phone Number:**
- If format is incorrect → kindly explain: "I need a Jordan mobile number starting with 07 and 10 digits total, like 0791234567"
- If digits are missing or extra → ask them to provide the correct 10-digit number

**Date Issues:**
- If date is in the past → gently inform: "That date has passed. Could you provide a date from today onwards?"
- If date is unclear → ask for clarification with format example: "Could you specify the date? For example: December 25, 2025"

**Party Size:**
- If more than 12 guests → inform: "For parties larger than 12, I'd recommend calling us directly at [restaurant number] so we can arrange the best seating for your group!"
- If party size seems inconsistent with context → confirm: "Just to confirm, you need a table for [X] people?"

**Name Issues:**
- If only first name provided → ask warmly: "And what's your last name?"
- If name seems incomplete → verify gently

========================
CONFIRMATION STEP (MANDATORY)
========================
**Before outputting JSON, you MUST:**
1. Present a clear, friendly summary of ALL collected information:
   "Perfect! Let me confirm your reservation details:
   - Name: [Full Name]
   - Phone: [Phone Number]
   - Date: [Day, Month Date, Year]
   - Time: [HH:MM]
   - Party Size: [Number] guests
   
   Does everything look correct?"

2. Wait for user confirmation (yes, correct, looks good, confirm, etc.)

3. If user says "no" or wants to change something → ask what needs to be updated

4. ONLY after explicit confirmation → output the JSON

5. Once you detect an intent , your response can only be a json with the following format if all required fields are collected and user has confirmed:

========================
JSON OUTPUT FORMAT
========================
When confirmed, output ONLY this pure JSON (no markdown, no extra text):

{
  "status": "ready_for_routing",
  "intent": "${supportedIntents}",
  "name": "...",
  "phone": "...",
  "date": "YYYY-MM-DD",
  "timeSlot": "HH:MM",
  "partySize": 2,
  "reservationId": "..."
}

========================
TONE & BEHAVIOR
========================
• Be warm, friendly, and conversational - like a helpful friend
• Use encouraging language: "Great!", "Perfect!", "Wonderful!"
• Show empathy if there are issues: "I understand...", "No worries at all..."
• Be patient with corrections or changes
• Extract multiple pieces of information from a single message when possible
• Keep responses concise but warm
• Never sound robotic or procedural
• If user seems confused, offer gentle guidance
• Thank them at the end: "Thank you for choosing The Grand Table!"

========================
EXAMPLES OF GOOD RESPONSES
========================
"Hi there! I'd be happy to help you make a reservation at The Grand Table. What date and time were you thinking?"

"Just to make sure I have this right - did you mean 7:00 PM (19:00)? We're open from 11:00 AM to 11:00 PM."

"I have everything except your last name. Could you share that with me?"

"Perfect! Let me confirm your reservation for 4 guests on Friday, December 20th at 7:00 PM under the name John Smith. Phone: 0791234567. Does that all look correct?"
`,
      },
    ];
  }

  // Conversation memory
  private getConversation(userId: string) {
    if (!this.conversations.has(userId)) {
      this.conversations.set(userId, [...this.basePrompt()]);
    }
    return this.conversations.get(userId)!;
  }

  resetConversation(userId: string) {
    this.conversations.set(userId, [...this.basePrompt()]);
    this.lastReplies.set(userId, []);
    this.logger.log(`Conversation reset for user ${userId}`);
  }

  // LOOP DETECTION
  private detectLoop(userId: string, reply: string): boolean {
    const list = this.lastReplies.get(userId) || [];

    list.push(reply);

    // Keep only last 5 replies
    if (list.length > 5) list.shift();

    this.lastReplies.set(userId, list);

    // If last 3 replies are identical → loop detected
    if (list.length >= 3) {
      const last3 = list.slice(-3);
      const isLoop = last3.every(r => r === last3[0]);

      if (isLoop) {
        this.logger.warn(`Loop detected for ${userId}`);
        return true;
      }
    }

    return false;
  }

  // ------------------------------------------------------------------
  // LLM Interaction
  // ------------------------------------------------------------------
  async generateResponse(
    userId: string,
    userInput: string,
  ): Promise<{ reply: string; routingPayload?: any }> {

    if (!this.openai) {
      return {
        reply: 'OpenAI is disabled because no API key is configured.',
      };
    }

    const history = this.getConversation(userId);

    history.push({ role: 'user', content: userInput });

    let llmReply = '';

    try {
      const completion = await this.openai.chat.completions.create({
        model: process.env.OPEN_AI_MODEL || 'gpt-4o',
        temperature: 0.6,
        messages: history,
      });

      llmReply = completion.choices[0].message.content ?? '';
    } catch (err) {
      this.logger.error('OpenAI Error:', err);
      return { reply: 'Sorry, something went wrong.' };
    }

    // ------------------------------------------
    // Loop detection BEFORE saving the message
    // ------------------------------------------
    if (this.detectLoop(userId, llmReply)) {
      this.resetConversation(userId);
      return {
        reply: "I feel like we're going in circles 😅 — let's start fresh.\nHow can I help you?"
      };
    }

    // Save assistant response into memory
    history.push({ role: 'assistant', content: llmReply });

    // ------------------------------------------
    // Detect JSON routing — NO AUTO RESET ANYMORE
    // ------------------------------------------
    if (llmReply.includes('"status": "ready_for_routing"')) {
      const json = this.extractJson(llmReply);

      if (json) {
        // ❌ DO NOT RESET
        return { reply: 'ROUTING_READY', routingPayload: json };
      }
    }

    return { reply: llmReply };
  }

  async injectSystemFeedback(userId: string, msg: string) {
    const history = this.getConversation(userId);

    history.push({
      role: 'system',
      content: msg,
    });
  }

  // JSON extraction helper
  private extractJson(msg: string) {
    const match = msg.match(/\{[\s\S]*\}/);
    if (!match) return null;

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}
