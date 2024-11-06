

# -----------------simulated annealing
import random
import math
import time

random.seed(time.time())

class Player():
    def __init__(self, name, rating):
        self.name = name
        self.rating = rating

class Group():
    def __init__(self, name, players):
        self.name = name
        self.players = players
        self.ratingMean = 0.0

        #calc rating mean
        for player in self.players:
            self.ratingMean += player.rating / len(self.players)

        self.score = 0

    def printInfo(self):
        a = '%s(%s, %s):'%(self.name,str(round(self.score,3)),str(round(self.ratingMean,3)))
        b = ['%s(%s)'%(player.name, str(round(player.rating,3))) for player in self.players]

        print(a,b)

    def swap(self, playerIndex, other_group, other_playerIndex):
        player = self.players[playerIndex]
        other_player = other_group.players[other_playerIndex]

        #detract from group.ratingMean
        self.ratingMean -= player.rating / len(self.players)
        other_group.ratingMean -= other_player.rating / len(other_group.players)

        #add..
        self.ratingMean += other_player.rating / len(self.players)
        other_group.ratingMean += player.rating / len(other_group.players)

        #swap
        self.players[playerIndex] = other_player
        other_group.players[other_playerIndex] = player

    def calcScore(self, against_ratingMean):
        error_margin = 2 #amount off global_ratingMean allowed
        self.score = 1 if abs(self.ratingMean - against_ratingMean) > error_margin else 0 #
        #add more here, eg other than rating


#set players
players = [Player('a',1100), Player('b',1080), Player('c',410),
           Player('d',1030), Player('e',1000), Player('f',1000),
           Player('g',900), Player('h',1000), Player('i',700),
           Player('j',1000)]

#
random.shuffle(players)

#set groups
groups = [Group('G1', players[0:5]), Group('G2', players[5:10])]



#
global_ratingMean = 0.0

for player in players:
    global_ratingMean += player.rating / len(players)


print('global rating mean is %f\n'%(global_ratingMean))


for group in groups:
    group.calcScore(global_ratingMean)


print("Initial groups are:")
for group in groups:
    group.printInfo()



#begin


startTemp = 10.0
coolingRate = 0.9999
temp = startTemp

while temp > 0.1:
    # cycles = 43 * (startTemp-temp)

    #
    group1_index = 0
    group2_index = 0

    while group1_index == group2_index:
        group1_index = random.randrange(0,len(groups))
        group2_index = random.randrange(0,len(groups))

    group1 = groups[group1_index]
    group2 = groups[group2_index]

    #pick random players from each group
    group1_playerIndex = random.randrange(0,len(group1.players))
    group2_playerIndex = random.randrange(0,len(group2.players))

    #
    group1_old_score = group1.score
    group2_old_score = group2.score

    group1.swap(group1_playerIndex, group2, group2_playerIndex)
    group1.calcScore(global_ratingMean)
    group2.calcScore(global_ratingMean)

    #
    scoreDifAvg = ((group1.score - group1_old_score)+(group2.score - group2_old_score))/2.0

    if scoreDifAvg > 0.0:
        p = math.exp(-scoreDifAvg/temp)

        if random.random() >= p:
            #swap back
            group1.swap(group1_playerIndex, group2, group2_playerIndex)
            group1.score = group1_old_score
            group2.score = group2_old_score


    temp*=coolingRate

#

print("\nOutput groups are:")
for group in groups:
    group.printInfo()






# ----------------genetic algorithm
# #include <iostream>
# #include "individual.h"

# //means, totals
# float develop, document, gpa, model, social;
# int genders[2], whens[3];

# //initial
# std::vector<Person*> people;
# std::vector<Group*> baseGroups;

# //
# std::vector<Individual*> population;

# void init() {
# 	//set people num, group num

# 	//calc min, max group sizes and nums

# 	//generate people

# 	//calc totals, means

# 	//fill base groups

# 	//create population
# 		//generate genome
# 		//copy base groups
# 		//calculate groups
# 		//score groups
# 		//score individual


# }

# void uninit() {
# 	//delete base groups

# 	//delete population
# 		//delete their groups

# 	//delete people
# }

# void run() {
# 	//until number of loops
# 		//select individuals for reproduction
# 		//breed selected individuals, with some random mutations in the offspring

# 		//for population
# 			//calculate groups
# 			//score groups
# 			//score individual

# }

# int main(int argc, char *argv[]) {

# 	init();
# 	run();
# 	uninit();

# 	system("pause");

# 	return 0;
# }
