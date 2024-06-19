#include <iostream>
#include <map>
#include <string>

using namespace std;

int main()
{
    int currPick = 1;
    map<int, string> draftOrder;

    draftOrder[1] = "Chicago Bears";
    draftOrder[2] = "Washington Commanders";
    draftOrder[3] = "New England Patriots";

    string prospects [] = {"Caleb Williams", "Jayden Daniels", "Drake Maye"};
    int prospectsSize = sizeof(prospects) / sizeof(prospects[0]);

    cout << "The 2024 NFL draft has begun!" << endl << endl;
    while (draftOrder.size() > 0)
    {
        cout << "The " << draftOrder[currPick] << " are on the clock with pick #" << currPick << "." << endl << endl;

        cout << "Draft Choices:\n";
        cout << "1. Make a Pick\n";
        cout << "2. Make a Trade\n";
        cout << "Enter your choice (1-2): ";

        int choice;
        cin >> choice;

        switch (choice) {
            case 1:
                cout << "You've chosen to make a pick.\n";
                cout << "The available prospects are: " << endl;
                for (int i = 0; i < prospectsSize; i++){
                    cout << prospects[i] << " " << endl;
                }
                
                break;
            case 2:
                cout << "You've chosen to make a trade.\n";
                break;

            default:
                cout << "Please select a valid option (1-2).\n\n";
                break;
        }

        draftOrder.erase(currPick);

        currPick++;
    }

    cout << "The first round of the 2025 NFL draft is now complete!" << endl;

    return 0;
}
