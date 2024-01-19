export class User{
  user_id!:number;
  firstname!:string;
  lastname!:string
  email!:string;
  username!:string;
  password!:string;
}
export class Contact {
  contact_id: number;
  user: User;
  contactedUser: User;

  constructor(contact_id: number, user: User, contactedUser: User) {
    this.contact_id = contact_id;
    this.user = user;
    this.contactedUser = contactedUser;
  }
}
