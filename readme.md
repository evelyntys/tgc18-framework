To start mysql, in the terminal, type in `mysql -u root`

# Create a new database user
In the MySQL CLI:
```
CREATE USER 'ahkow'@'localhost' IDENTIFIED BY 'rotiprata123';
```

```
GRANT ALL PRIVILEGES on sakila.* TO 'ahkow'@'localhost' WITH GRANT OPTION;
```
**Note:** Replace *sakila* with the name of the database you want the user to have access to
 
 ```
FLUSH PRIVILEGES;
```

grant all privileges on *.* to 'foo'@'%';
=> user will gain access to all databases

package-lock -> npm install
yarn.lock -> yarn add
lock file to remember which version of packages you are using so that it will specifically pull down those again when you do yarn install/npm install
if not, it will always pull down the latest version -> may not be compatible

for deployment to heroku -> can only have either package-lock or yarn.lock ALONE -> delete package-lock or yarn depending on which u use more

create migration (does NOT change database) > execute migration > update

./db-migrate.sh up
those migration that has not been run will be run, those already ran will not run

ORMS//
oldest- bookshelf
newest- sequalize
typeorm

cross-site scripting: people try to hack into your website by typing in html to your form
always escape with double braces if we want to do html escaping {{}}