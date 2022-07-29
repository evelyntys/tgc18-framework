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

have to run nodemon --ignore sessions because nodemon will restart server every time it detects a change
=> meaning that if any files appear in sessions (e.g. new user detected resulting in a new sesssion),
it will cause nodemon to restart server
.gitignore since nothing to do with github and may contain sensitive information

flash messages only work if you do a redirect
'
use new migration file to rename column, add colum etc instead of doing down 

if browser never get success message from browser, it will keep retrying
when it is successful, all the requests passses through and results in many users created

middleware = chain of responsibility 
everytime we have an app.use => middleware
pass on to next middleware and so on => if no more middleware, will pass to route

sessions only works for dynamic web app e.g. browsers, NOT FOR REACT APP
API - jwt to login/logout

{{!-- function e to prevent it from going back to the first page ('#') --}}

 {{!-- add event listener to the upload button --}}
    {{!-- need to have valid link for a tag for it to be rendered --}}

            {{!-- callback function: will be called only when the widget finished uploading --}}
  {{!-- display the widget --}}

  {{!-- pass the parameter to sign to the cloudinary route in the query string --}}

  {{!-- callback is given by cloudinary --}}