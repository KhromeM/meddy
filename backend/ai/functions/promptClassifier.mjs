// we want a way of classifying partial prompts, based on the partial transcript (just a string), we want to use an llm to classify the user request.

// We will classify as one of the following:
// 1. is it a request to get their profile info?
// 2. is it a request to update/set their profile info?
// 3. is it a request to start / end translation mode?
// 4. is it just a normal question? (our default)

// Constraints:
// 1. send it liek the past 5 chat messages for context
// 2. and use a smallish system prompt so it answers back fast
// 3. also dont pass in the conversation history the way we do now. pass it as a part of the system prompt. otherwise its gonna see the conversational nature of the chat history and respond back in the same way.

import { openAIModel } from "../ai/langAi/model.mjs";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { chatStreamProvider } from "../ai/langAi/chatStream.mjs";
import { StringOutputParser } from "@langchain/core/output_parsers";
import CONFIG from "../config.mjs";

const classifyPartialPrompt = async (
  partialTranscript,
  recentMessages,
  user
) => {
  const systemPrompt = `
You are a classification assistant for Meddy AI. Categorize the user's partial input into one of these types:
1. Profile Info Request
2. Profile Info Update
3. Translation Mode Toggle
4. Normal Question (default)

Recent chat context:
${recentMessages
  .slice(-5)
  .map((msg) => `${msg.source}: ${msg.text}`)
  .join("\n")}

Respond with ONLY the number corresponding to the classification.`;

  const messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(partialTranscript),
  ];

  const chain = openAIModel.pipe(new StringOutputParser());

  try {
    // const result = await chatStreamProvider(partialTranscript, user, openAIModel, 1, recentMessages);
    const result = await chain.invoke(messages);
    const classification = parseInt(result.trim());
    return isNaN(classification) ? 4 : classification;
  } catch (error) {
    console.error("Error classifying partial prompt:", error);
    return 4; // Default to Normal Question in case of error
  }
};

const handleClassifiedPrompt = async (
  classification,
  partialTranscript,
  user
) => {
  switch (classification) {
    case 1: // Profile Info Request
      return await handleProfileInfoRequest(user);
    case 2: // Profile Info Update
      return await handleProfileInfoUpdate(partialTranscript, user);
    case 3: // Translation Mode Toggle
      return toggleTranslationMode(user);
    default: // Normal Question
      return null; // Let the main chat flow handle this
  }
};

async function handleProfileInfoRequest(user) {
  return "info";
}

async function handleProfileInfoUpdate(partialTranscript, user) {
  return "update";
}

function toggleTranslationMode(user) {
  return "translation";
}

export const useClassification = async (
  partialTranscript,
  chatHistory,
  user
) => {
  const classification = await classifyPartialPrompt(
    partialTranscript,
    chatHistory,
    user
  );
  return await handleClassifiedPrompt(classification, partialTranscript, user);
};
