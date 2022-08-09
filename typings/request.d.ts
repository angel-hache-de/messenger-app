export interface ISignUpRequest {
  userName: string;
  email: string;
  password: string;
  passwordConf: string;
  /**
   * this property is in the req.files
   */
  image?: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IMessageCreateRequest {
  receptorId: string;
  text: string;
}

export interface IMessageUpdateRequest {
  messageId: string;
  status: MESSAGE_STATUS;
}

export interface IMessageRequest {
  text: string;
  images: Files[];
  receptorId: string;
  createdAt: Date;
}

export interface ITypingMessageRequest {
  isTyping: boolean;
  receptorId: string;
}

export interface IUpdateMessageSocketRequest {
  status: MESSAGE_STATUS;
  receptorId: string;
}
