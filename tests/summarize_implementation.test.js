const fetchMock = require('jest-fetch-mock');
const { summarize, displayBubbles, hideBubbles, createChatLi } = require('../frontend/js/chatbot-response.js');

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
    summarize: jest.fn(),
    displayBubbles: jest.fn(),
    hideBubbles: jest.fn(),
    createChatLi: jest.fn()
  };
});

// Mocking the fetch function for testing purposes
jest.mock('node-fetch', () => ({
  fetch: jest.fn(),
}));


// Unit Test
describe('Summarization Feature Unit Tests', () => {
  test('summarize function should be called', async () => {
    // Mock pdfURL
    const pdfURL = 'mocked-pdf-url';

    // Creating a mock function for summarize
    const originalSummarize = global.summarize;

    try {
      // Call the function
      await summarize(pdfURL);

      // Use await to wait for asynchronous operations to complete
      await new Promise((resolve) => process.nextTick(resolve));

      // Assert that the summarize function is called
      expect(summarize).toHaveBeenCalled();

      // Assert that the summarize function is called with the correct arguments
      expect(summarize).toHaveBeenCalledWith(pdfURL);

    } catch (error) {
      // Assert error
      expect(error).toBeInstanceOf(Error);
    } finally {
      // Restore the original implementation of the summarize function
      global.summarize = originalSummarize;
    }
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

    // Check if displayBubbles and hideBubbles are called
    expect(displayBubbles).not.toBeNull();
    expect(hideBubbles).not.toBeNull();

    // Check if createChatLi is called
    expect(createChatLi).not.toBeNull();

    // check if the chatbox has a new child with the generated message
    const generatedMessage = mockData.content;
    const generatedMessageElement = Array.from(chatbox.querySelectorAll('li.incoming p')).find((p) => p.textContent.includes(generatedMessage));
    expect(generatedMessageElement).not.toBeNull();
  });
});

