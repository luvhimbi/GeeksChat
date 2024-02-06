export class User {
  user_id!: number;
  firstname!: string;
  lastname!: string;
  email!: string;
  username!: string;
  password!: string;
  online?: boolean; // New field to track user presence
}
export class Contact {
  contact_id: number;
  user: User;
  contactedUser: User;
  canChat : boolean ;

  constructor(contact_id: number, user: User, contactedUser: User , canChat : boolean) {
    this.contact_id = contact_id;
    this.user = user;
    this.contactedUser = contactedUser;
    this.canChat = canChat;
  }
}
