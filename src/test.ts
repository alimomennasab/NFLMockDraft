import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function testInput() {
  try {
    const answer = await askQuestion('Enter the number of rounds to draft (1-3): ');
    console.log(`You entered: ${answer}`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    rl.close();
  }
}

testInput();
