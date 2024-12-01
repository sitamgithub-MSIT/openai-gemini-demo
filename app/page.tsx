"use client";

// Importing the necessary libraries
import { useEffect, useRef, useState } from "react";
import { Send, User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

// Importing components from the UI kit
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define the message type
interface Message {
  user: string;
  text: string;
  isTyping?: boolean;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBox.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessages = [...messages, { user: "user", text: input }];
      setMessages(newMessages);
      setInput("");
      setIsTyping(true);

      try {
        const allMessages = newMessages.reduce(
          (acc, message) =>
            acc +
            `${
              message.user === "user"
                ? "question: " + message.text
                : "answer: " + message.text
            }` +
            "\n\n",
          ""
        );

        const response = await fetch("/api/chat", {
          body: JSON.stringify({ message: allMessages }),
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const reply = await response.json();
        setIsTyping(false);
        setMessages([...newMessages, { user: "assistant", text: reply }]);
      } catch (error) {
        console.error("Error fetching response:", error);
        setIsTyping(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center">OpenAI Gemini Demo</CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            A simple chat interface powered by Gemini models accessible via the
            OpenAI libraries (TypeScript / Javascript). Read more about it in
            the{" "}
            <a
              href="https://ai.google.dev/gemini-api/docs/openai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Gemini docs
            </a>
            .
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScrollArea className="h-[500px] rounded-md border p-4">
            <div ref={chatBox} className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 ${
                    message.user === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 rounded-full p-2 ${
                      message.user === "user" ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    {message.user === "user" ? (
                      <User className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <Bot className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.user === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    } max-w-[80%]`}
                  >
                    <div className="text-sm text-black prose prose-sm dark:prose-invert prose-p:my-0 prose-headings:my-0 max-w-none">
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 rounded-full p-2 bg-muted">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="rounded-lg px-4 py-2 bg-muted text-muted-foreground max-w-[80%]">
                    <p className="text-sm">Thinking...</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
