# MUSGAME - A Website for Music Learning Games (or any JavaScript Games)

#### Video Demo: https://youtu.be/jmf9nrGCx1k

#### Description:
A website that currently consists of six games (or tools). The admin can add a game by using HTML, CSS, JavaScript, and a big thumbnail photo. The admin can also delete any game. Users can play this game with or without logging in. If a user is logged in, they can add any game to their favorites. Five of the current six games have musical notations display. This is the power of a JavaScript framework called VexFlow. Although VexFlow only supports displaying notation, I had come up with a work around for users to be able to input notation on one of the game. The only game without notation acts more like a tool for music educators and learners.

#### Distinctiveness and Complexity:
The distinctiveness of this project is the use of VexFlow (a JavaScript framework for music notation) and also some other Django and JavaScript techniques that were not required in any of the previous projects.

Here are some specific examples of the distinctiveness and complexity:
- VexFlow (a JavaScript framework for displaying music notation)
- An original solution to make VexFlow notation inputable via HTML elements and attributes (This is very complex especially to input pitches on a populated stave with specific spots for coloring and accidental.)
- Django models with images and files
- Delaying JavaScript execution (on the game Random Pitch to see random pitches running)
- Music theory logics within the JavaScript code.

#### Files Created:
1. musgame/util.py for the helper function to execute paginator and to filter the game list

2. musgame/templates/musgame/
- game_html/ contains all the .html files for all the games
- action.html for functioning as a layout to showing the current game
- category_indiv.html for listing games based on selected category
- category.html for listing the category
- index.html for listing all games and listing favorite games
- layout.html for the layout of the whole site
- login.html for log-in
- register.html for register

3. musgame/static/musgame/
- game_css/ contains all the .css files for all the games
- game_js/ contains all the .js files for all the games
- media/ contains all the game logos in .png files for all the games
- action.js is the JavaScript file for the action.html (mainly for the favorite button)
- styles.css is the CSS file for the whole site

#### How to Use - Platform Features:
1. Act like a platform for JavaScript game. Although I choose for the admin to be the only one who can add or delete any games. Required files to add a game are:
- .html
- .css
- .js
- .png

2. Listing the game by all game, by category, and by favorites. Logged-in user can add or remove favorites for themself.

3. Currently there are six current games that I created. Each of the game gains more complexity as I get more comfortable with VexFlow.

#### How to Use - Games (or Tools) Features:
1. Pitch Reading (Treble Clef)
- The game will generate a random pitch which will be shown in a music notation on a treble clef via VexFlow.
- The user will read and input the correct pitch and accidental via buttons with JavaScript.

2. Pitch Reading (Bass Clef)
- The game will generate a random pitch which will be shown in a music notation on a bass clef via VexFlow.
- The user will read and input the correct pitch and accidental via buttons with JavaScript.

3. Jazz Interval Identification
- The game will generate a random bass pitch and a jazz music interval.
- The game will calculate the resulting pitch with that generated interval above the bass pitch.
- The game will the resulting pitch in a music notation via VexFlow and show the bass pitch in text.
- The user will find the jazz interval and its type then input the answer via buttons with JavaScript.

4. Interval Identification
- The game will generate a random bass pitch and a classical music interval.
- The game will calculate the resulting pitch with that generated interval above the bass pitch.
- The game will show the bass pitch and the resulting pitch both in a music notation on a same stave via VexFlow.
- The user will find the classical interval and its type then input the answer via buttons with JavaScript.

5. Upper Intervallic Notation
- This is the most complex part of the project. VexFlow only support displaying notation but does not support inputting notation. I came up with a solution involving placing invisible staves to receive notation input.
- The game will generate a random bass pitch and a classical music interval.
- The game will calculate the resulting pitch with that generated interval above the bass pitch.
- The game will show the bass pitch in a music notation via VexFlow and the interval in text.
- The user will input the correct pitch to form that interval above the given bass pitch.
- The user can add an accidental using button with JavaScript.
- After checking the answer and if the answer is wrong, the game will show the correct answer in both text and notation. The correct answer will be in red. In the notation on the music stave, only the revealed correct answer will be in red. The rest of the user input notation will still be in black.

6. Random Pitch
- This is more like a tool, not a game.
- The user will either pick pitches (at least two pitches) from the cycle of fifth on the left hand or choose pre-selected groups of pitch from the types on the right hand.
- After selecting at least two pitches, the user will press random to start random the pitch.
- The program will random a pitch from the selected pitches.
- The program will display the random pitches fast running scrambling in text and will stop on a pitch as the result of the random.

#### Required Library:
- pip3 install Django
- pip3 install Pillow

##### Technologies:
- Python
- JavaScript
- Django
- VexFlow
- Bootstrap

##### Collaborators:
This is a solo project by Sopon Suwannakit using frameworks like Django, Bootstrap, and VexFlow.

##### License:
The project is finished and will be uploaded to my profile on GitHub as one of my portfolios.

##### Project Status:
Version 1.0