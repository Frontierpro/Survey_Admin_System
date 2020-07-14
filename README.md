# Survey_Admin_System

This is a survey administration system implemented based on B/S architecture. It can complete creation, distribution, fill and delete of a survey. Any users or visitors can use it on the browser.

### Introduction

\- Architecture Build

This system is a B/S application. The front end uses HTML5 + CSS3 + JQuery and the server end uses NodeJS. The content structure of the web server is as follows.

```
> Survey_Admin_System (root)
    > App_Server
        > server
            - *.js
            ...
        - server.js
    > Data_Layer
        > sql
            - initial.sql
        - sql.js
    > File_System
        > css
            - *.css
            ...
        > html
            - *.html
            ...
        > img
            - *.png
            - *.jpg
            ...
        > js
            - *.js
            ...
```

This is the architecture of the whole system or web server. 

* ```File_System``` stores all the front end files which will be transformed to the browser and show UI after interpretion. Files in this folder are divided by their type or function.

* ```Data_Layer``` is the model interacts with mysql database. ```sql.js``` is the script used to carry out a specific mysql instruction. And the ```sql``` folder stores any sql scripts used to initial database, the ```initial.sql``` are not recommended to delete or modify because it builds the basic structure of the database. You can add anything.sql to insert initial data to fill the database.

* ```App_Server``` is the web server of this system. ```server.js``` is responsible to config the router of each service path. All kinds of services are stored in ```server``` folder and their import paths are configured by ```server.js```.

So, the architecture of this system is very clear, and it is easy to add any extensions no matter to the front end or the back end. If you want to add new web page, just insert the new resources into ```File_System``` according to the file type. If you want to add new service, just insert new extension script into ```App_Server/server``` and add its routing path into ```App_Server/server.js```.

\- Environment Prepare

According to the application architecture, you need to install the following tools.

* [NodeJS](https://nodejs.org/zh-cn/download/).

* [MySQL](https://dev.mysql.com/downloads/mysql/)

There are also some other dependencies needed to be install, NodeJS offers a package manager, npm. You can use the follow instructions to install these dependency packages with NodeJS npm.

```
npm install express
npm install mysql
npm install body-parser
npm install async
```

There dependencies are required in this version. If you develop any extensions using other dependencies, just install them as you wish.

\- Using Method

Download this repo and unzip it. You need to do some changes to adjust to your local attribution. Note: these operations cannot skip!

* Install all dependencies required.

* In ```App_Server/server.js```, you can modify the value in ```app.listen()``` to change the web server listen port. Here we set ```8080``` as default port number.

* In ```Data_Layer/sql.js```, you can modify parameters in ```mysql.createConnection()``` to adapt to local mysql connection.

* Carry out ```Data_Layer/sql/initial.sql``` in mysql terminal to build the database of this system. If you have any data prepared, just put these sqls into this folder and carry out them. Here, the recommended method for creating sql files is: Using this system to interact with database automatically and get sql file from database with the following instructions.


```
mysqldump -u root -p survey_admin_system user_info > user_info.sql
mysqldump -u root -p survey_admin_system survey_info > survey_info.sql
mysqldump -u root -p survey_admin_system survey_question > survey_question.sql
mysqldump -u root -p survey_admin_system survey_option > survey_option.sql
mysqldump -u root -p survey_admin_system answer_info > answer_info.sql
mysqldump -u root -p survey_admin_system option_answer > option_answer.sql
mysqldump -u root -p survey_admin_system text_answer > text_answer.sql
```

Note: The export filename should be at the correct absolute path!

Then you can turn to the App_Server folder in the terminal and enter the follow instruction to start the web server of this system.

```
node server.js
```

Turn to your browser, enter ```127.0.0.1:8080/index.html```. You come to the the system index page.
