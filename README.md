# JS 2 Homework
## Techmagic homework for the "JavaScript" Lecture 2

### How to start the project
Project is ready to run by opening index.html in a browser locally or if run on a web server (including Live Server plugin for IDE)

The app gets data from https://jsonplaceholder.typicode.com/users and generates list of users.
After that app generates avatars using https://cataas.com/ service, which returns square images of cats.
Each user has Edit and Delete buttons.
Edit button opens a form where changes can be made and if changes are confirmed, PUT-request is maid to the placeholder service. In case of succesfull response new data is used to update the user in the list.
Delete button sends DELETE-request to the server and deletes the user from the list.
