# Task Forest-Zeynep's List
This is a project made for module Java and Web Development for IU International University of Applied Sciences.
## About the app:
Task Forest is an easy-to-use, super simple task app.
Working as a visual online planner, it will help you facilitate your everyday life. You can create and update tasks, check them when they are done, and delete them when they no longer serve. 
With its built-in Pomodoro timer, you can set your desired focus and break times. The app will also keep track of your focus sessions, so you’ll know exactly how many sessions of work you did. The alarm at the end of each session will alert you.
## Features:
- Create, delete, and update tasks as needed.
- Set the timer to the desired minutes.
- Restore the timer to its default state.
- Have a little fun treat with the confetti.
## Tech Stack
### Front-end:
- HTML: This is the skeleton of the web page.
- CSS: Makes the application very pretty by allowing styling.
- JS: Ensures that the buttons and the timers work correctly, allowing a functional dynamic user experience.
- Bootstrap: Consists of pre-made styled elements for speedy styling.
- EJS: Allows real-time rendering and simplifies dynamic programming.
### Back-end:
- Node.js: Server that allows elements from the front-end to be processed and saved, and to the site to be hosted on the internet.
- Express.js: Framework that simplifies creating routes.
- Mongoose: Mongo framework that aid in simplifying code to access and edit Mongo database items.
- MongoDB: Database that stores the list items.
## Instructions:
To run the application locally:
- clone the repository using `git clone https://github.com/zeynepseyitoglu/To-Do-List-App.git`.
- Install dependencies using `npm i`.
- Start mongo server **mongod** on your device.
- Navigate into the `server` folder and start the server by running `node index`.
- Run the application on your browser at `http://localhost:3000`.
## Test cases:
### User registration:
- Register to the app by entering email and password into the corresponding areas.
- If register is successful the main page will render.
- Check database for successfull user creation.
### User login:
- Enter the registered username and the password into the corresponding fields.
- If both are true, the application will redirect to the main page.
- If its not, it will redirect to the login page.
### Adding tasks:
- Write your text in the text field, then click "+".
### Updating tasks:
- Rewrite your text in the list items' text field then click the update button.
### Deleting tasks:
- Click the trash button on the item you want to delete.
### Making sure that the timer keeps running when page is refreshed:
- Start the timer and refresh the page.
## Test data: 
- For registration -> **email:**`forest@abc.com`, **password:**`123`
- For login -> **email:**`forest@abc.com`, **password:**`123` 
