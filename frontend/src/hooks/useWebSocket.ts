
import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  sender: 'user' | 'doctor';
  content: string;
  timestamp: Date;
  type: 'text' | 'system';
}

interface UseWebSocketProps {
  doctorName: string;
  onMessage?: (message: Message) => void;
}

export const useWebSocket = ({ doctorName, onMessage }: UseWebSocketProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'doctor',
      content: `Hello! I'm ${doctorName}, your AI medical assistant. I'm here to help answer your health questions and provide guidance. How are you feeling today?`,
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const conversationHistory = useRef<string[]>([]);

  useEffect(() => {
    // Simulate WebSocket connection
    const connectWebSocket = () => {
      setIsConnected(true);
      console.log('WebSocket connected (simulated)');
    };

    const timer = setTimeout(connectWebSocket, 1000);
    
    return () => {
      clearTimeout(timer);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    conversationHistory.current.push(userMessage);
    
    // Symptom-related responses
    if (lowerMessage.includes('pain') || lowerMessage.includes('hurt') || lowerMessage.includes('ache')) {
      if (lowerMessage.includes('head') || lowerMessage.includes('headache')) {
        return "I understand you're experiencing head pain. Can you describe the type of pain - is it throbbing, sharp, or a dull ache? Also, when did it start and have you noticed any triggers like stress, lack of sleep, or certain foods?";
      }
      if (lowerMessage.includes('chest')) {
        return "Chest pain can have various causes. Is it a sharp, stabbing pain or more of a pressure sensation? Are you experiencing any shortness of breath, dizziness, or nausea along with it? If this is severe or sudden, please consider seeking immediate medical attention.";
      }
      if (lowerMessage.includes('back')) {
        return "Back pain is quite common. Is this lower back, upper back, or neck area? Did it start after any particular activity or movement? On a scale of 1-10, how would you rate the pain intensity?";
      }
      return "I hear that you're experiencing pain. Can you help me understand more about it? Where specifically does it hurt, when did it start, and how would you describe the sensation?";
    }

    // Fever-related responses
    if (lowerMessage.includes('fever') || lowerMessage.includes('temperature') || lowerMessage.includes('hot')) {
      return "A fever can indicate your body is fighting an infection. Have you taken your temperature? Are you experiencing any other symptoms like chills, body aches, or fatigue? How long have you been feeling this way?";
    }

    // Cold/flu symptoms
    if (lowerMessage.includes('cough') || lowerMessage.includes('cold') || lowerMessage.includes('flu') || lowerMessage.includes('sneezing')) {
      return "These symptoms could indicate a respiratory infection. Are you experiencing a dry or productive cough? Any congestion, sore throat, or body aches? Have you been around anyone who's been sick recently?";
    }

    // Medication questions
    if (lowerMessage.includes('medication') || lowerMessage.includes('medicine') || lowerMessage.includes('drug') || lowerMessage.includes('pill')) {
      return "I can help with medication questions. Are you asking about a specific medication, its dosage, potential side effects, or interactions? Please provide the name of the medication if you're comfortable sharing.";
    }

    // Mental health
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || lowerMessage.includes('depressed') || lowerMessage.includes('worried')) {
      return "Thank you for sharing that with me. Mental health is just as important as physical health. Can you tell me more about what's been causing these feelings? Are there specific situations or times when you feel this way more intensely?";
    }

    // Sleep issues
    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired') || lowerMessage.includes('insomnia') || lowerMessage.includes('fatigue')) {
      return "Sleep issues can significantly impact your overall health. Are you having trouble falling asleep, staying asleep, or waking up too early? How many hours of sleep are you typically getting, and has your sleep routine changed recently?";
    }

    // Digestive issues
    if (lowerMessage.includes('stomach') || lowerMessage.includes('nausea') || lowerMessage.includes('vomit') || lowerMessage.includes('diarrhea')) {
      return "Digestive symptoms can be uncomfortable. Can you describe what you're experiencing in more detail? Have you eaten anything unusual recently, or could this be related to stress or a medication change?";
    }

    // General wellness
    if (lowerMessage.includes('healthy') || lowerMessage.includes('wellness') || lowerMessage.includes('prevention')) {
      return "That's wonderful that you're thinking about preventive health! A healthy lifestyle includes regular exercise, a balanced diet, adequate sleep, stress management, and regular check-ups. Is there a particular aspect of wellness you'd like to focus on?";
    }

    // Appreciation responses
    if (lowerMessage.includes('thank') || lowerMessage.includes('appreciate')) {
      return "You're very welcome! I'm here to help and support your health journey. Please don't hesitate to reach out if you have any other questions or concerns.";
    }

    // Follow-up questions
    if (lowerMessage.includes('better') || lowerMessage.includes('improved')) {
      return "I'm glad to hear you're feeling better! It's important to monitor your symptoms. If anything changes or if you have concerns about your recovery, please let me know.";
    }

    // Emergency keywords
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('severe')) {
      return "If you're experiencing a medical emergency, please call emergency services immediately or go to your nearest emergency room. I'm here to provide guidance, but emergency situations require immediate professional medical attention.";
    }

    // Contextual responses based on conversation history
    if (conversationHistory.current.length > 1) {
      const lastMessage = conversationHistory.current[conversationHistory.current.length - 2];
      if (lastMessage && lastMessage.toLowerCase().includes('pain')) {
        return "Thank you for providing more details about your symptoms. Based on what you've shared, I'd recommend documenting when the symptoms occur and their intensity. Have you tried any treatments or remedies so far?";
      }
    }

    // Default intelligent responses
    const contextualResponses = [
      "I understand your concern. Can you provide me with more specific details about your symptoms, including when they started and how they're affecting your daily activities?",
      "Thank you for sharing that information with me. To better assist you, could you describe any additional symptoms you might be experiencing or any factors that seem to make it better or worse?",
      "I appreciate you reaching out about this. Every person's health situation is unique. Can you help me understand more about your medical history or any medications you're currently taking that might be relevant?",
      "That's a valid health concern. To provide you with the most helpful guidance, could you tell me about the severity of your symptoms and whether this is something you've experienced before?",
      "I'm here to help you navigate this health concern. Can you share more details about the timeline of your symptoms and whether there were any specific triggers or events that preceded them?",
    ];

    return contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
  };

  const sendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    onMessage?.(userMessage);

    // Show typing indicator
    setIsTyping(true);
    
    // Generate AI response with realistic delay
    setTimeout(() => {
      setIsTyping(false);
      
      const aiResponse = generateAIResponse(content);
      
      const doctorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'doctor',
        content: aiResponse,
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, doctorMessage]);
      onMessage?.(doctorMessage);
    }, 1500 + Math.random() * 2000); // Realistic typing delay
  };

  return {
    messages,
    isConnected,
    isTyping,
    sendMessage,
    setMessages
  };
};
