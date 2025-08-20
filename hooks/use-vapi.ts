"use client";

import Vapi from "@vapi-ai/web";
import { useState, useRef, useEffect, useCallback } from "react";

// Define a type for the call status for better type safety
type CallStatus = "inactive" | "loading" | "active" | "error";

export const useVapi = () => {
  // Retrieve credentials from environment variables
  const vapiPublicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
  const vapiAssistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
  
  // Debug logging
  console.log('=== useVapi Hook Debug ===');
  console.log('vapiPublicKey:', vapiPublicKey);
  console.log('vapiAssistantId:', vapiAssistantId);
  console.log('Environment check:', typeof window !== 'undefined' ? 'Client-side' : 'Server-side');

  // State to manage the Vapi instance
  const vapiRef = useRef<Vapi | null>(null);

  // UI-driving states
  const [callStatus, setCallStatus] = useState<CallStatus>("inactive");
  const [conversation, setConversation] = useState<any[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  // Initialize Vapi and set up event listeners
  const initializeVapi = useCallback(() => {
    console.log('=== initializeVapi called ===');
    console.log('vapiPublicKey available:', !!vapiPublicKey);
    console.log('vapiAssistantId available:', !!vapiAssistantId);
    
    if (!vapiPublicKey) {
      console.error("Vapi Public Key is not set in environment variables.");
      setCallStatus("error");
      return;
    }

    const vapiInstance = new Vapi(vapiPublicKey);
    vapiRef.current = vapiInstance;

    vapiInstance.on("call-start", () => {
      console.log("Call has started.");
      setCallStatus("active");
    });

    vapiInstance.on("call-end", () => {
      console.log("Call has ended.");
      setCallStatus("inactive");
      setConversation([]); // Clear conversation on call end
    });

    vapiInstance.on("message", (message) => {
      console.log("Message received:", message);
      if (message.type === "transcript") {
        setConversation((prev) => [...prev, message]);
      }
    });

    vapiInstance.on("error", (error) => {
      console.error("Vapi error:", error);
      setCallStatus("error");
    });

    // Clean up on component unmount
    return () => {
      vapiInstance.stop();
      vapiRef.current = null;
    };
  }, [vapiPublicKey]);

  // Effect to initialize Vapi on component mount
  useEffect(() => {
    const cleanup = initializeVapi();
    return cleanup;
  }, [initializeVapi]);

  // Function to start or stop a call
  const toggleCall = async () => {
    console.log('=== toggleCall called ===');
    console.log('vapiRef.current:', !!vapiRef.current);
    console.log('callStatus:', callStatus);
    
    if (!vapiRef.current) {
      console.error('Vapi instance not available');
      return;
    }
    
    setCallStatus("loading");
    try {
      if (callStatus === "active") {
        console.log('Stopping call...');
        vapiRef.current.stop();
      } else {
        if (!vapiAssistantId) {
          console.error("Vapi Assistant ID is not set.");
          setCallStatus("error");
          return;
        }
        console.log('Starting call with assistant ID:', vapiAssistantId);
        await vapiRef.current.start(vapiAssistantId);
      }
    } catch (err) {
      console.error("Error toggling Vapi call:", err);
      setCallStatus("error");
    }
  };
  
  // Function to toggle mute
  const toggleMute = () => {
    if (!vapiRef.current) return;
    const newMutedState = !isMuted;
    vapiRef.current.setMuted(newMutedState);
    setIsMuted(newMutedState);
  };

  return {
    callStatus,
    conversation,
    isMuted,
    toggleCall,
    toggleMute,
  };
}; 