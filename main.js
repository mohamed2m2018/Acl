import { a, an } from './acl.js';
a('admin')
  .can('post')
  .to('posts');

an('admin')
  .can('post')
  .to('posts');
  an('admin')
  .can('get')
  .to('posts');

