//Testing example
//Note: the roles will be saved automatically in the server file system to be persistent 

//require module

const acl=require('access-control-list-module');
const {createRole,a,an,check}=acl;

// create different roles

createRole('admin');
createRole('user');
createRole('guest');

// admin can list all users

an('admin')
  .can('get')
  .from('/users');

// admin can create users

an('admin')
  .can('post')
  .to('/users');

// user can post an article only when it's his data

a('user')
  .can('post')
  .to('/users/:userId/articles')
  .when((params, user) => user.id === params.userId);

// guest can get data from articles

a('guest')
  .can('get')
  .from('/articles');

//checking

console.log(
  check
    .if('guest')
    .can('post')
    .to('/users')
); // false

console.log(
  check
    .if('admin')
    .can('post')
    .to('/users')
); // true

// check if a user can post to /users/10/articles

console.log(
  check
    .if('user')
    .can('post')
    .to('/users/10/articles')
    .when({ id: 10 })
); // true

// check if a user can post to /users/articles

console.log(
  check
    .if('user')
    .can('post')
    .to('/users/articles')
); // false

