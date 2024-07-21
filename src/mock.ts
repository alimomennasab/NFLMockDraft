import * as readline from 'readline';
import { getDraftOrder, getProspects, getDraftCapital, getTradeChart } from './database';

type DraftOrder = { [key: number]: string };

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function draft() {
  let draftOrder: DraftOrder = await getDraftOrder();
  let prospects: string[] = await getProspects();
  let currPick: number = 1;

  console.log('The 2025 NFL draft has begun!\n');

  while (Object.keys(draftOrder).length > 0) {
    console.log(`${draftOrder[currPick]} are on the clock with pick #${currPick}.\n`);

    console.log('Draft Choices:');
    console.log('1. Make a Pick');
    console.log('2. Make a Trade');
    let choice: number = parseInt(await askQuestion('Enter your choice (1-2): '));

    switch (choice) {
      case 1: {
        console.log("You've chosen to make a pick.");
        console.log('The available prospects are: ');
        for (let i = 0; i < prospects.length; i++) {
          if (prospects[i]) {
            console.log(`${i + 1}: ${prospects[i]} ()`);
          }
        }
        let prospectSelection: number = parseInt(
          await askQuestion('Select the number of the prospect: ')
        );

        if (prospectSelection >= 0 && prospectSelection < prospects.length && prospects[prospectSelection]) {
          console.log(
            `The ${draftOrder[currPick]} have selected ${prospects[prospectSelection]} at pick #${currPick}.\n`
          );
          prospects.splice(prospectSelection, 1); // Remove the selected prospect
        } else {
          console.log('Invalid selection. Please select a valid prospect number.');
        }
        break;
      }
      case 2:
        console.log("You've chosen to make a trade.");
        break;
      default:
        console.log('Please select a valid option (1-2).\n');
        break;
    }

    delete draftOrder[currPick];

    currPick++;
  }

  console.log('The first round of the 2025 NFL draft is now complete!');
  rl.close();
}

draft();
