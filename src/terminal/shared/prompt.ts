export function ask(rl, question): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

export async function askValidated(
  rl,
  question,
  validator,
  optional = false,
): Promise<string | undefined> {
  while (true) {
    const input = await ask(rl, question);

    if (optional && !input) return undefined;

    const err = validator(input);
    if (!err) return input;

    console.log(` ${err}`);
  }
}
