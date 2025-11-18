import { printIntro } from '../shared/prints';

export function printSmartIntro() {
  printIntro('Smart Mode (AI-Powered)');

  console.log(`
 Rasheedah here!  
I am running in SMART MODE — powered by OpenAI.  
I understand full natural language, detect your intent,  
and guide you in a human-friendly way 

Commands:
   • reset – restart the conversation
   • exit – leave smart mode

-------------------------------------------------------------
`);
}
