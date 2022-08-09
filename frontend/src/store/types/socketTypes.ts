export interface ITypingMessageResponse {
  emitterId: string;
  isTyping: boolean;
}

export interface ITypingMessageRequest {
  isTyping: boolean;
  receptorId: string;
}
