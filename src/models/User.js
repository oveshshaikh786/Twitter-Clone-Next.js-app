import { Schema, model, models } from 'mongoose';
import Cover from '../components/Cover';

const UserSchema = new Schema({
  name: String,
  email: String,
  image: String,
  username: String,
  cover: String,
  bio: String,
  id: String,
});

const User = models?.User || model('User', UserSchema);
export default User;
