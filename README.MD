# Access Control List Module

ACL (Access Control List) specifies which group of users are granted access to objects,
as well as what operations are allowed on given objects.

### Installing

Just download the package from your terminal
```
npm i access-control-list-module

```

###To Create New Role:
A user role can be defined by calling a createRole method on the module

```
createRole('admin');

```

```
createRole('guest');

```

###To Set Permissions:
Permissions should be defined using functions a and an, like so:

```
an('admin').can('post').to('/users');

```

```
a('guest').can('get').from('/users');

```

You can also set conditional permissions based on parameters in the path you set permission for using the when function:

```
a('user').can('post').to('/users/:userId/articles').when((params, user) =>
user.id === params.userId);

```
The when function always receives a an object params as a first parameter. The params object
holds values for defined URL parameters.

###To check Permissions:

```
check.if('admin').can('post').to('/users'); //true

```

When checking checking using the when function you don't need to send the params, you only need to dend the other
arguments that you have passed to when function while setting the permissions for that path   

```
check.if('user').can('post').to('/users/10/articles').when({ id: 10 });

```

## Getting Started

Just try this example


//require module


const {createRole,a,an,check}=require('access-control-list-module');

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

