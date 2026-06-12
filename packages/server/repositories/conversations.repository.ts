const conversations = new Map<string, string>();

export const conversationRepository = {
  getConversationResponseId: (conversationId: string): string | undefined => {
    return conversations.get(conversationId);
  },
  setConversationResponseId: (
    conversationId: string,
    responseId: string
  ): void => {
    conversations.set(conversationId, responseId);
  },
};
