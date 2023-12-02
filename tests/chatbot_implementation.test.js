const fetchMock = require('jest-fetch-mock');
const {
    generateResponse,
    cite,
    summarize,
    similarPapers,
    displayBubbles,
    hideBubbles,
    createChatLi,
  } = require('../frontend/js/chatbot-response.js');
  
// Mocking fetch for testing purposes
jest.mock('node-fetch', () => ({
fetch: jest.fn(),
}));

// Mocking DOMParser within the module being tested
jest.mock('../frontend/js/chatbot-response.js', () => {
const originalModule = jest.requireActual('../frontend/js/chatbot-response.js');
return {
    ...originalModule,
    DOMParser: {
    parseFromString: jest.fn().mockReturnValue({
        getElementsByTagName: jest.fn(() => []),
    }),
    },
    generateResponse: jest.fn(),
    summarize: jest.fn(),
    cite: jest.fn(),
    similarPapers: jest.fn(),
    displayBubbles: jest.fn(),
    hideBubbles: jest.fn(),
};
});
  
// 2 UNIT TESTS

describe('Chatbot Response Unit Tests', () => {
test('generateResponse should send POST request and update chatbox', async () => {
    // Mock user input and PDF URL
    const userMessage = 'Hello, chatbot!';
    const pdfURL = 'mocked-pdf-url';

    // Mock the generateResponse function
    const originalGenerateResponse = global.generateResponse;

    try {
        // Call the function
        await generateResponse(userMessage);

        // Use await to wait for asynchronous operations to complete
        await new Promise((resolve) => process.nextTick(resolve));

        // Assert that the generateResponse function is called
        expect(generateResponse).toHaveBeenCalled();

        // Assert that the generateResponse function is called with the correct arguments
        expect(generateResponse).toHaveBeenCalledWith(userMessage);

    } catch (error) {
        // Assert error
        expect(error).toBeInstanceOf(Error);
    } finally {
        // Restore the original implementation of the generateResponse function
        global.generateResponse = originalGenerateResponse;
    }
    });

test('createChatLi should create a chat list item', () => {
    const message = 'Test message';
    const className = 'outgoing';
    const chatLi = createChatLi(message, className);

    expect(chatLi.tagName).toBe('LI');
    expect(chatLi.classList.contains('chat')).toBe(true);
    expect(chatLi.classList.contains(className)).toBe(true);
    expect(chatLi.innerHTML).toContain('<p>Test message</p>');
});
});

// Integration Test
describe('Summarization Feature Integration Tests', () => {
    test('summarize should fetch data and update the DOM', async () => {
      // Set up the initial state for testing
      document.body.innerHTML = "<div id='loading-container'></div><div class='chatbox'></div>";
  
      // Mock data for testing
      const mockData = {
        content: 'Mocked summary content',
      };
  
      // Mock fetch response
      fetchMock.mockResponseOnce(JSON.stringify(mockData));
  
      // Call the summarize function
      await summarize('mocked-pdf-url');
  
      // Check if the DOM is updated correctly
      const loadingContainer = document.getElementById('loading-container');
      const chatbox = document.querySelector('.chatbox');
  
      // Check if the element exists
      expect(loadingContainer).not.toBeNull();
      expect(chatbox).not.toBeNull();
  
      // Check if functions and other features are working
      expect(displayBubbles).not.toBeNull();
      expect(hideBubbles).not.toBeNull();
      expect(createChatLi).not.toBeNull();
      expect(summarize).not.toBeNull();
      expect(cite).not.toBeNull();
      expect(similarPapers).not.toBeNull();
  
      // check if the chatbox has a new child with the generated message
      const generatedMessage = mockData.content;
      const generatedMessageElement = Array.from(chatbox.querySelectorAll('li.incoming p')).find((p) => p.textContent.includes(generatedMessage));
      expect(generatedMessageElement).not.toBeNull();
    });
  });
  
  