# Approach

Since simon keeps playing a new note on top of the previous sequence, I decided to use an array and keep adding to it as the game went on. I originally used a while true loop without thinking, and that failed because of obvious reasons. After that, I decided to have the game continue based on the state of the game after the player clicked instead, since the game would never actually progress if the player never clicked. Once the user clicks, the game also checks if they failed by matching up the note they clicked with the note Simon played. When Simon plays, the notes are disabled. I used a "Start Game" button because notes wouldn't play until the user has interacted with the site in some way, according to the error I was given by the developer console.



#Resources

I googled a lot to find what methods there are in JavaScript I may not know about/may have forgotten about that I could in my implementation, or to find documentation for methods I'm using. I'd often land on w3schools.com.