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

![](Intro_Img/index.png)

This page introduce the function and using method of this system. But if you want to use this system, firstly, you need to get an ID. So, at the top right part of this page. Click ```register``` or ```login```, you can jump to the corresponding page. Here, I show the register page and login page on the mobile browser.

![](Intro_Img/register.png)

![](Intro_Img/login.png)

When you log in with your ID, you will enter user home page. In this page, you can check the surveys you published, delete any one of them and get their share link.

![](Intro_Img/home.png)

You can click on creating a survey, then you will jump to edit page.

![](Intro_Img/edit.png)

Firstly, you need to fill the title and the authority of getting user's ID. Then you can click the plus signal at the bottom to insert a problem below. You can delete any problem by clicking the cross signal at the top right of the problem. When you create a problem, the first thing you need to do is selecting the type of it. If you change the type of a problem to single selection or multiple selection, an adding option button will occur below the title filling texture of this problem. You can click this button to add an option below or click on the cross signal corresponding to any option to delete one. You can also select a pre-problem and a pre-option for a problem, but in this situation, the type of pre-problem must be single selection. If editor defines a problem with pre-selection, then this problem will not display on a user's screen initially until he selects the pre-option for the pre-problem. After finishing editing, you can click on the button at the bottom of the page to publish this survey and you will return to home page automatically.

There are three buttons on each survey. You can click on delete to drop this survey from database. Note: Delete the survey will not only drop the questions of this survey but also clear all the answers of this survey. You can click on share link to get the filling share link. Click this button, the share link will automatically copy to the system clipboard. Then you can share this link to your friends, workmates, anyone you wish.

When a visitor get the share link, he just start his browser, paste the link on the address bar and he will come to the fill page.

![](Intro_Img/fill.png)

Fill all the questions and click on submit is ok. Here there are two tips.

* If this survey requires your ID, you need to login firstly. If you are not at online status, you will jump to the login page automatically and return to this page after login.

* Some problems with pre-request will not display initially until you select the specific option of a specific question.

Finally, you can click on the check result button to check the results of a survey.

![](Intro_Img/result.png)

You can select which user's or visitor's answer you would like to check from the selection texture below the title.
