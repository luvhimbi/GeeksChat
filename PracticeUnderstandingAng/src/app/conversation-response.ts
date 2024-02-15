export interface ConversationResponse {
  conversationId: string;
  otherUserId: number;
  otherUserName: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  isPinned: Boolean;
  isArchived: boolean; // Add this property
}

export interface Conversation{
  conversationId : string,
  user1 : number,
  user2 : number
}
