export async function smartCommands(rl, command, orchestrator, userId) {
  switch (command) {
    case 'exit':
      console.log('\n Goodbye!\n');
      return 'exit';

    case 'reset':
      orchestrator.openai.resetConversation(userId);
      console.log('\n Conversation reset! Start fresh.\n');
      return true;

    default:
      return false;
  }
}
