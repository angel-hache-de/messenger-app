// class Chat  implements IChat{
//     public users = {};
//     constructor(uid, name, msg) {
//       this.uid = uid;
//       this.name = name;
//       this.msg = msg;
//     }
//   }

export type Users = {
  [user: string]: string;
};

class Chat {
  // Users connected
  public users: Users = {};

  constructor() {
    //   this.messages = [];
    //   this.users = {};
  }

  // get last10() {
  //   this.messages = this.messages.splice(0, 10);
  //   return this.messages;
  // }

  get userArr() {
    return Object.values(this.users);
  }

  // sendMessage(uid, name, msg) {
  //   this.messages.unshift(new Message(uid, name, msg));
  // }

  connectUser(userId: string) {
    this.users[userId] = userId;
  }

  disconnectUser(uid: string) {
    delete this.users[uid];
  }
}

export default Chat;
