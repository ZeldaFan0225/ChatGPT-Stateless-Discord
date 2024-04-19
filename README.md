# How to set up

1) Do the basic cloning the project stuff
2) fill out env
- bot token should be obv
- application public key you can find under apps overview => general information => public key (second blue button)
- openai token should be obv as well
- client id is right above public key
3) set up nginx to proxy pass requests from the domain you want to use (e.g. https://interactions.example.com) to the port you set in .env
4) start the app
5) take the link you proxy passed, go to discord dev page, go to app overview => interactions endpoint url (first texbox of block of 4 at the bottom)
6) save and hope that it accepts your link