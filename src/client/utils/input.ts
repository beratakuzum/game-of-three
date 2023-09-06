import * as readline from "readline";

export function getUserInput(prompt: string, callback: (number: number) => void): void {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function askForInput() {
    rl.question(prompt, (userInput) => {
      const number = parseInt(userInput);

      if (!isNaN(number) && Number.isInteger(number) && number >= 0) {
        rl.close();
        callback(number);
      } else {
        console.log('Invalid input. Please enter a valid whole number.');
        askForInput(); // Ask an input again
      }
    });
  }
  askForInput();
}