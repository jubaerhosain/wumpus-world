# About Wumpus World Game Project
1. There will be 10x10 grid and can be multiple Wumpus, Gold and Pitin the squares.
2. An AI agent will be implemented, that will collect all the gold with falling into Infinite loop.
3. Agent will get sense Stench, Breeze, Glitter if the is Wumpus, Pit and Gold in the  adjacent squares.
4. Agent can move up-down-left-right but can't walks into a wall.
5. The AI agent's  task is to collect all the gold without falling into Pit or killed by Wumpus.

### Note: Rules are same as static wumpus game with one exception: there will be no evlution of best path


<br><br>


##  Algorithm for AI Agent
To implement the AI agent here we will implement Propositional Logic. Our knowledge base will be a multidimantion array of object, where the object will hold some knowledge and that knowledge will updated after each move.

### some terminology
OK(xy) = the position (x,y) is safe for the agent<br>
P(xy) = There is Pit in position (x,y)<br>
W(xy) = There is Wumpus in position (x,y)<br>
G(xy) = There is Gold in position (x,y)<br>
B(xy) = There is Stench in position (x,y)<br>
S(xy) = There is Stench in position (x,y)<br>

algo:
1. Set a 10x10 array with a object. The Object will hold:
    i.      noWumpus: null<br>
    ii.     noPit: null<br>
    iii.    maybeWumpus: null<br>
    iv.     maybePit: null<br>
    v.      breeze: null<br>
    vi.     stench: null<br>
    vii.    safe: null<br>

2. Push (1,1) in nextVisitableSquare (a queue) as next visitable squere where agent can visit by visiting multiple squere.
3. Defile a array path= []
3. While nextVisitableSquare is not null do 4-8:
4. pop a squere (x,y) and check the following conditions.
5. Go to that index and store the moves into path.

6. if ~S(x,y) set (x,y+1), (x,y-1), (x+1,y), (x-1,y) = no wuppus.
[~S(xy) <=> ~W(xy) ^ ~W(xy+1) ^ ~W(xy-1) ^ ~W(x-1y) ^ ~W(x+1y)]

7. if ~B(x,y) set (x,y+1), (x,y-1), (x+1,y), (x-1,y) = no Pit.
[~B(xy) <=> ~P(xy) ^ ~P(xy+1) ^ ~P(xy-1) ^ ~P(x-1y) ^ ~P(x+1y)]

8. Now check if any squere (xy) is both "no wumpus" & "no pit", if then push it into the nextVisitableSquare queue.
9. Print the path. 