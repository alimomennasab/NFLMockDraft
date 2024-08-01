import os
from dotenv import load_dotenv
import psycopg2
from selenium.webdriver import Safari
from selenium.webdriver.common.by import By
import time
import re

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

driver = Safari()

"""Scraping prospects"""
def scrape_prospects():
    # wipe existing data
    cur.execute("TRUNCATE TABLE prospects RESTART IDENTITY CASCADE;")
    url = 'https://www.nflmockdraftdatabase.com/big-boards/2025/consensus-big-board-2025'
    driver.get(url)

    players = driver.find_elements(By.XPATH, '//div[@class="player-name player-name-smaller"]')
    rankings = driver.find_elements(By.XPATH, '//div[@class="pick-number with-subtitle"]')
    details = driver.find_elements(By.XPATH, '//div[@class="player-details college-details"]')

    prospects = []
    num_players = min(len(players), len(rankings), len(details))

    for i in range(num_players):
        if i > 100:
            break

        player_name = players[i].text
        player_ranking = int(rankings[i].text)
        detail_text = details[i].text.split(' | ')[0]  # position
        school = details[i].find_element(By.TAG_NAME, 'a').text  # school

        prospects.append((player_ranking, player_name, detail_text, school))
        print(f"Added {player_name} (#{player_ranking}) ({detail_text}) {school}")

    # sort all prospects by their overall ranking
    prospects.sort(key=lambda x: x[0])

    # insert sorted prospects into the database
    for player_ranking, player_name, position, school in prospects:
        cur.execute(
            "INSERT INTO prospects (ranking, name, position, school) VALUES (%s, %s, %s, %s)",
            (player_ranking, player_name, position, school)
        )
    
    print("Prospect scraping complete")

"""Scraping teams, their draft order, and draft capital"""
def scrape_teams():
    # wipe existing data
    cur.execute("TRUNCATE TABLE draft_order RESTART IDENTITY CASCADE;")
    cur.execute("TRUNCATE TABLE draft_capital RESTART IDENTITY CASCADE;")

    url = 'https://www.tankathon.com/nfl'
    driver.get(url)

    teams = driver.find_elements(By.XPATH, '//div[@class="desktop"]')
    picks = driver.find_elements(By.XPATH, '//td[@class="pick"]')
    team_links = driver.find_elements(By.XPATH, '//td[@class="name"]/a')

    print(f"Teams found: {len(teams)}, Picks found: {len(picks)}, Team links found: {len(team_links)}")
    num_teams = min(len(teams), len(picks), len(team_links))

    # store team data initially
    team_data = []
    for i in range(num_teams):
        team_name = teams[i].text
        pick_number = int(picks[i].text)
        team_url = team_links[i].get_attribute('href')
        team_data.append((team_name, pick_number, team_url))

    # scraping team and draft order
    for team_name, pick_number, team_url in team_data:
        print(f"Adding {team_name} (Pick #{pick_number}) with URL {team_url}")
        cur.execute(
            "INSERT INTO draft_order (team_name, pick_number) VALUES (%s, %s)",
            (team_name, pick_number)
        )

        # navigate to the team page to get draft capital
        driver.get(team_url)
        time.sleep(2)  # adding a small delay to ensure the page loads

        draft_picks = driver.find_elements(By.XPATH, '//div[@class="pick-card-round"]')
        print(f"Draft picks found for {team_name}: {len(draft_picks)}")

        picks = []
        for pick in draft_picks:
            pick_and_round = pick.text
            print(f"Found pick: {pick_and_round}")
            cleaned_pick_number = re.sub(r'[^\d.]', '', pick_and_round) # remove words from pick ("comp") but keep decimal point

            # converting the round and pick number (ex: 2.2 is round 2, pick 2 -> #34 pick)
            round_num, pick_num = cleaned_pick_number.split('.')
            picks.append((int(round_num) - 1) * 32 + int(pick_num))

        print(f"Adding {team_name}'s draft capital: {picks}")
        cur.execute(
            "INSERT INTO draft_capital (team_name, picks) VALUES (%s, %s)",
            (team_name, picks)
        )

        # navigate back to the main page
        driver.get(url)
        time.sleep(2)  # small delay so the page loads

    print("Scraping teams complete")


""" Scraping draft capital trade value chart (Jimmy Johnson's Trade Chart) """
def scrape_trade_chart():
    # wipe existing data
    cur.execute("TRUNCATE TABLE trade_chart RESTART IDENTITY CASCADE;")

    url = 'https://raw.githubusercontent.com/leesharpe/nfldata/master/data/draft_values.csv'
    driver.get(url)
    raw_data = driver.find_element(By.XPATH, '//pre')
    raw_text = raw_data.text
    lines = raw_text.strip().split('\n')
    pick_values = []
    for i in range (1, len(lines)): # skip the header title line
        words = lines[i].split(',')
        pick_val = words[2].strip()  # in the csv file, the third elem of each row is the desired Jimmy Johnson trade value
        pick_values.append(pick_val)
        cur.execute(
                "INSERT INTO trade_chart (pick_number, value) VALUES (%s, %s)",
                (i, pick_val)
            )
        print("Added ", pick_val)

    print("Amount of Jimmy Johnson draft values: ", len(pick_values))

scrape_prospects()
scrape_teams()
scrape_trade_chart()

conn.commit()
cur.close()
conn.close()
driver.close()
