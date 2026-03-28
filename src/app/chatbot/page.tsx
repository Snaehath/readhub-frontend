import { Metadata } from "next";
import ChatbotView from "@/components/chatbot/chatbot-view";

export const metadata: Metadata = {
  title: "Ask AI",
  description: "Chat with your intelligent reading companion.",
};

const ChatbotPage = () => {
  return <ChatbotView />;
};

export default ChatbotPage;
