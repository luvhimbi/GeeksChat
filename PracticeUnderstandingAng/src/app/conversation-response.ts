export interface ConversationResponse {
  conversationId: string;
  otherUserId: number;
  otherUserName: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  isPinned: boolean;
  isArchived: boolean; // Add this property
}
