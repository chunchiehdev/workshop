import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());

// Conversation states
const FLOW_STATES = {
  INITIAL: 'initial',
  ASSESSING_RELEVANCE: 'assessing_relevance',
  ASSESSING_COMPLETENESS: 'assessing_completeness',
  ASKING_FOR_MORE_INFO: 'asking_for_more_info',
  PROVIDING_GUIDANCE: 'providing_guidance',
  AWAITING_CONFIRMATION: 'awaiting_confirmation',
  PROVIDING_ANSWER: 'providing_answer',
  CONVERSATION_END: 'conversation_end'
};

// Science Q&A endpoint
app.post('/api/science-qa', async (req, res) => {
  try {
    const { message, conversationHistory, conversationState } = req.body;
    
    const response = await processScientificQuestion(
      message, 
      conversationHistory || [], 
      conversationState || {
        flowState: FLOW_STATES.INITIAL,
        incompleteQuestionCount: 0,
        hasReceivedGuidance: false,
        currentQuestion: null
      }
    );
    
    res.json(response);
  } catch (error) {
    console.error('Error in science-qa endpoint:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      response: '抱歉，我遇到了一些技術問題。請稍後再試。',
      conversationState: {
        flowState: FLOW_STATES.INITIAL,
        incompleteQuestionCount: 0,
        hasReceivedGuidance: false,
        currentQuestion: null
      }
    });
  }
});

async function processScientificQuestion(userMessage, conversationHistory, conversationState) {
  const { flowState, incompleteQuestionCount, hasReceivedGuidance, currentQuestion } = conversationState;
  
  // Initialize Gemini chat with conversation history
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  // Convert conversation history to Gemini format
  // Filter out initial assistant greeting and ensure first message is from user
  const chatHistory = conversationHistory
    .filter(msg => msg.role === 'user' || msg.role === 'assistant')
    .slice(1) // Remove the initial greeting message
    .map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

  // Ensure we don't pass empty history or history starting with model
  const validHistory = chatHistory.length > 0 && chatHistory[0].role === 'user' ? chatHistory : [];

  const chat = model.startChat({
    history: validHistory
  });

  // Handle different flow states
  switch (flowState) {
    case FLOW_STATES.INITIAL:
    case FLOW_STATES.ASSESSING_RELEVANCE:
      return await assessScienceRelevance(chat, userMessage, conversationState);
    
    case FLOW_STATES.ASSESSING_COMPLETENESS:
      return await assessQuestionCompleteness(chat, userMessage, conversationState);
    
    case FLOW_STATES.AWAITING_CONFIRMATION:
      return await handleConfirmation(chat, userMessage, conversationState, conversationHistory);
    
    default:
      // For any unexpected state, restart the flow
      return {
        response: '讓我們重新開始。請問您有什麼科學相關的問題嗎？',
        conversationState: {
          flowState: FLOW_STATES.INITIAL,
          incompleteQuestionCount: 0,
          hasReceivedGuidance: false,
          currentQuestion: null
        }
      };
  }
}

async function assessScienceRelevance(chat, userMessage, conversationState) {
  // Step 1: Check if the question is science-related
  const relevancePrompt = `
請分析以下問題是否與科學相關（包括物理、化學、生物、數學、電腦科學、地球科學、天文學、工程學等領域）。

問題：「${userMessage}」

請只回答「科學相關」或「非科學相關」，不需要其他解釋。
`;

  const relevanceResult = await chat.sendMessage(relevancePrompt);
  const isScience = relevanceResult.response.text().includes('科學相關');
  
  if (!isScience) {
    return {
      response: '這個問題似乎與科學無關。請問您有什麼科學相關的問題嗎？您可以重新提問！',
      conversationState: {
        flowState: FLOW_STATES.INITIAL,
        incompleteQuestionCount: 0,
        hasReceivedGuidance: false,
        currentQuestion: null
      }
    };
  }
  
  // If science-related, proceed to assess completeness
  return await assessQuestionCompleteness(chat, userMessage, {
    ...conversationState,
    flowState: FLOW_STATES.ASSESSING_COMPLETENESS,
    currentQuestion: userMessage
  });
}

async function assessQuestionCompleteness(chat, userMessage, conversationState) {
  // Step 2: Check if the science question is complete and clear
  const completenessPrompt = `
請判斷以下科學問題是否完整且清晰，能夠被直接理解並回答。

評估標準：
- 問題是否具體明確
- 是否包含足夠的背景資訊
- 是否可以直接提供有意義的答案

問題：「${userMessage}」

請只回答「完整清晰」或「不夠完整」，不需要其他解釋。
`;

  const completenessResult = await chat.sendMessage(completenessPrompt);
  const isComplete = completenessResult.response.text().includes('完整清晰');
  
  if (isComplete) {
    // Question is complete - ask for confirmation
    return await askForConfirmation(chat, userMessage, conversationState);
  } else {
    // Question is incomplete
    const newIncompleteCount = conversationState.incompleteQuestionCount + 1;
    
    if (newIncompleteCount >= 3 && !conversationState.hasReceivedGuidance) {
      // Provide 5W1H guidance
      return await provide5W1HGuidance(chat, userMessage, {
        ...conversationState,
        incompleteQuestionCount: newIncompleteCount,
        hasReceivedGuidance: true,
        flowState: FLOW_STATES.PROVIDING_GUIDANCE
      });
    } else {
      // Ask for more information
      return await askForMoreInformation(chat, userMessage, {
        ...conversationState,
        incompleteQuestionCount: newIncompleteCount,
        flowState: FLOW_STATES.ASKING_FOR_MORE_INFO
      });
    }
  }
}

async function askForConfirmation(chat, userMessage, conversationState) {
  const confirmationPrompt = `
學生提出了一個完整的科學問題：「${userMessage}」

請友善地確認這是否符合他們想要問的問題。回應格式：
"我理解您想了解關於 [簡要總結問題主題] 的問題。這是否符合您想要問的問題？請回答「是」或「否」。"

請用繁體中文回答，語氣友善且鼓勵。
`;

  const confirmationResult = await chat.sendMessage(confirmationPrompt);
  
  return {
    response: confirmationResult.response.text(),
    conversationState: {
      ...conversationState,
      flowState: FLOW_STATES.AWAITING_CONFIRMATION
    }
  };
}

async function askForMoreInformation(chat, userMessage, conversationState) {
  const clarificationPrompt = `
學生提出了一個不夠完整的科學問題：「${userMessage}」

請友善地要求他們提供更多具體資訊，幫助完善問題。
- 指出問題可能缺少的資訊
- 給出具體的建議他們可以補充什麼
- 保持鼓勵和支持的語氣

請用繁體中文回答。
`;

  const clarificationResult = await chat.sendMessage(clarificationPrompt);
  
  return {
    response: clarificationResult.response.text(),
    conversationState: {
      ...conversationState,
      flowState: FLOW_STATES.ASSESSING_RELEVANCE // Return to relevance check for next input
    }
  };
}

async function provide5W1HGuidance(chat, userMessage, conversationState) {
  const guidancePrompt = `
學生已經嘗試了3次提問，但問題都不夠完整。最近的問題是：「${userMessage}」

請用5W1H原則（誰Who、什麼What、哪裡Where、何時When、為什麼Why、如何How）為學生提供3個具體、聚焦的問題範例，幫助他們精確表達想了解的內容。

回應格式：
"看起來您想了解更多關於這個主題的資訊。讓我為您提供一些更具體的問題範例，您可以選擇其中一個：

1. [具體問題1]
2. [具體問題2] 
3. [具體問題3]

請選擇其中一個問題，或者參考這些範例重新組織您的問題。"

請用繁體中文回答。
`;

  const guidanceResult = await chat.sendMessage(guidancePrompt);
  
  return {
    response: guidanceResult.response.text(),
    conversationState: {
      ...conversationState,
      flowState: FLOW_STATES.AWAITING_CONFIRMATION
    }
  };
}

async function handleConfirmation(chat, userMessage, conversationState, conversationHistory) {
  // Check if user's response is positive or negative
  const confirmationCheckPrompt = `
用戶對確認問題的回答：「${userMessage}」

請判斷這是肯定回答還是否定回答。
肯定：是、對、正確、符合、好的、可以等
否定：不是、不對、不符合、不好、重新等

請只回答「肯定」或「否定」，不需要其他解釋。
`;

  const confirmationResult = await chat.sendMessage(confirmationCheckPrompt);
  const isPositive = confirmationResult.response.text().includes('肯定');
  
  if (isPositive) {
    // User confirmed - provide final answer
    return await provideFinalAnswer(chat, conversationState.currentQuestion || userMessage, conversationState);
  } else {
    // User denied - restart the process
    return {
      response: '好的，讓我們重新開始。請重新提出您的科學問題，我會幫助您完善它。',
      conversationState: {
        flowState: FLOW_STATES.INITIAL,
        incompleteQuestionCount: 0,
        hasReceivedGuidance: false,
        currentQuestion: null
      }
    };
  }
}

async function provideFinalAnswer(chat, question, conversationState) {
  const answerPrompt = `
現在請回答學生的科學問題：「${question}」

請提供：
1. 準確且科學的答案
2. 適合學生理解的解釋
3. 清晰的結構和邏輯

回答完成後，請加上："如果您還有其他科學問題，請隨時提問！"

請用繁體中文回答。
`;

  const answerResult = await chat.sendMessage(answerPrompt);
  
  return {
    response: answerResult.response.text(),
    conversationState: {
      flowState: FLOW_STATES.CONVERSATION_END,
      incompleteQuestionCount: 0,
      hasReceivedGuidance: false,
      currentQuestion: null
    }
  };
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Science Q&A API is running' });
});

app.listen(PORT, () => {
  console.log(`Science Q&A API server running on port ${PORT}`);
});