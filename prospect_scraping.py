from selenium.webdriver import Safari
from selenium.webdriver.common.by import By

driver = Safari()

# make a dictionary with positions and a list of prospects for each position
positions = ["QB", "RB", "WR", "TE", "OT", "IOL", "DL", "EDGE", "LB", "CB", "S", "K", "P", "LS"]
prospects = {position: [] for position in positions}


for position in positions:
    print("Position: ", position)
    url = 'https://www.nflmockdraftdatabase.com/big-boards/2025/consensus-big-board-2025?pos=' + position
    driver.get(url)
    players = driver.find_elements(By.XPATH, '//div[@class="player-name player-name-smaller"]')
    
    players_list = []
     # get the top 10 players per position, 
     # or the max number of players under unpopular positions (K/LS)
    for p in range(min(len(players), 10)):
        player_name = players[p].text
        players_list.append(player_name)
        # print("Added:", player_name)
        prospects[position] = players_list

driver.close()
print("Driver closed")

for position, players in prospects.items():
    print(f"\nTop 10 {position} prospects:")
    for player in players:
        print(player)