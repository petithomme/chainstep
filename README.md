# chainstep

## How to install on local:

- Install mysql (or a docker image) and create a user "chainstep" with password "chainstep" or modify the file "MysqlConnection.ts"
- In mySql : 
    - CREATE DATABASE chainstep;
    - CREATE TABLE users (userId int AUTO_INCREMENT PRIMARY KEY, username varchar(25) NOT NULL, password varchar(100) NOT NULL, salt varchar(32) NOT NULL, email varchar(100) NOT NULL, language varchar(2) NOT NULL);
    
- Run libreTranslate with this docker command : 
    - docker run -ti --rm -p 6000:5000 libretranslate/libretranslate (or install it from https://pythonrepo.com/repo/uav4geo-LibreTranslate)
    
- npm install 
- npm start
- connect to http://localhost:5000/

## Things to improve : 

- Migrations not manual
- Add unit tests
- Being able to add / remove chats
- Transform models to interfaces if no more code needed
   
