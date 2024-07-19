import os
from dotenv import load_dotenv
import psycopg2
from selenium.webdriver import Safari
from selenium.webdriver.common.by import By

# retrieve environmental variables
load_dotenv()
db_name = os.getenv("DB_NAME")
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")

# connect to postgres
conn = psycopg2.connect(
    dbname=db_name,
    user=db_user,       
    password=db_password,  
    host=db_host
)
cur = conn.cursor()

# Wipe existing data
cur.execute("TRUNCATE TABLE prospects RESTART IDENTITY CASCADE;")
cur.execute("TRUNCATE TABLE draft_order RESTART IDENTITY CASCADE;")

# Scraping prospects
driver = Safari()
def scrape_prospects():
    positions = ["QB", "RB", "WR", "TE", "OT", "IOL", "DL", "EDGE", "LB", "CB", "S"]
    prospects = []

    # Place every top 100 prospect in a list
    for position in positions:
        url = 'https://www.nflmockdraftdatabase.com/big-boards/2025/consensus-big-board-2025?pos=' + position
        driver.get(url)
        print("Position: ", position)

        players = driver.find_elements(By.XPATH, '//div[@class="player-name player-name-smaller"]')
        rankings = driver.find_elements(By.XPATH, '//div[@class="pick-number with-subtitle"]')
        print(f"Players: {len(players)} , Rankings: {len(rankings)}")

        num_players = min(len(players), len(rankings))

        for p in range(num_players):
            player_name = players[p].text
            player_ranking = int(rankings[p].text)
            if player_ranking > 100:
                print("Skipping rest of ", position)
                break
            prospects.append((player_ranking, player_name, position))
            print(f"Added {player_name} (#{player_ranking}) ({position})")

    # Sort all prospects by their overall ranking
    prospects.sort(key=lambda x: x[0])

    # Insert sorted prospects into the database
    for player_ranking, player_name, position in prospects:
        cur.execute(
            "INSERT INTO prospects (position, ranking, name) VALUES (%s, %s, %s)",
            (position, player_ranking, player_name)
        )

# Scraping teams and draft order
def scrape_teams():
    url = 'https://www.tankathon.com/nfl'
    driver.get(url)

    teams = driver.find_elements(By.XPATH, '//div[@class="desktop"]')
    picks = driver.find_elements(By.XPATH, '//td[@class="pick"]')
    print(f"Teams found: {len(teams)}, Picks found: {len(picks)}")

    num_teams = min(len(teams), len(picks))

    for i in range(num_teams):
        team_name = teams[i].text
        pick_number = int(picks[i].text)
        print(f"Adding {team_name} (Pick #{pick_number})")
        cur.execute(
            "INSERT INTO draft_order (team_name, pick_number) VALUES (%s, %s)",
            (team_name, pick_number)
        )

scrape_prospects()
scrape_teams()

conn.commit()
cur.close()
conn.close()
driver.close()
print("Scraping complete")
