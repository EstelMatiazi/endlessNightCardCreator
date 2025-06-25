# endlessNightCardCreator
A simple app to generate prototype cards for the upcoming (tm) endless night CCG

To run, start a node server and access the index.html file with ´npx live-server´ on the src folder (or with whatever local development src tool you use). 
The index file contains a button that asks for a .csv file. A sample one has been provided in the /data/ folder. 
Once the file has been loaded, all of the placeholder cards will be generated and a button for generating a .zip with them as .pngs will also be available. 
You can edit the .csv file to generate only the cards that you need, or edit them individually to the desired values. 

If you want to add custom image backgrounds for the cards, you need to do the following: 
1 - Look at the csv file and find out whats the Id of the card you wish to edit
2 - rename your images so that their name is the Id of the vampire that they will represent (something like '1.png' for the first vampire in the .csv file)
3 - add the desired images to the /images/backgrounds/ folder
4 - open app.js and insert the Id into the backgroundImageIds array located at the top of the file. 
