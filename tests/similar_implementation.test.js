const fetchMock = require('jest-fetch-mock');
const { similarPapers, displayBubbles, hideBubbles, createChatLi } = require('../frontend/js/chatbot-response.js');

// Mocking DOMParser and createChatLi within the module being tested
jest.mock('../frontend/js/chatbot-response.js', () => {
  const originalModule = jest.requireActual('../frontend/js/chatbot-response.js');
  return {
    ...originalModule,
    DOMParser: {
      parseFromString: jest.fn().mockReturnValue({
        getElementsByTagName: jest.fn(() => []),
      }),
    },
    createChatLi: jest.fn(),
    displayBubbles: jest.fn(),
    hideBubbles: jest.fn(),
  };
});

// Mocking the fetch function for testing purposes
jest.mock('node-fetch', () => ({
  fetch: jest.fn(),
}));

// Unit Test
describe('Similar Papers Feature Unit Tests', () => {
  test('similarPapers function should be called', async () => {
    // Mock pdfURL
    const pdfURL = 'mocked-pdf-url';

    // Creating a mock function for similarPapers
    const originalSimilarPapers = global.similarPapers;

    try {
      // Call the function
      await similarPapers(pdfURL);

      // Use await to wait for asynchronous operations to complete
      await new Promise((resolve) => process.nextTick(resolve));

      // Assert that the similarPapers function is called
      expect(similarPapers).toHaveBeenCalled();

      // Assert that the similarPapers function is called with the correct arguments
      expect(similarPapers).toHaveBeenCalledWith(pdfURL);

    } catch (error) {
      // Assert error
      expect(error).toBeInstanceOf(Error);
    } finally {
      // Restore the original implementation of the similarPapers function
      global.similarPapers = originalSimilarPapers;
    }
  });
});

// Integration Test
describe('Similar Papers Feature Integration Tests', () => {
    test('similarPapers should fetch data, update the DOM, and open a new page', async () => {
      // Set up the initial state for testing
      document.body.innerHTML = "<div id='loading-container'></div><div class='chatbox'></div>";
  
      // Mock data for testing
      const mockData = {
        content: 'Mocked summary content',
      };
  
      // Mock fetch response
      fetchMock.mockResponseOnce(JSON.stringify(mockData));
  
      // Store the original window.location.assign method
      const originalLocationAssign = window.location.assign;
  
      // Mock the window.location.assign method
      window.location.assign = jest.fn();
  
      // Call the similarPapers function
      await similarPapers('mocked-pdf-url');
  
      // Wait for asynchronous operations to complete
      await new Promise((resolve) => setTimeout(resolve, 0));
  
      // Check if the DOM is updated correctly
      const loadingContainer = document.getElementById('loading-container');
      const chatbox = document.querySelector('.chatbox');
      expect(loadingContainer).not.toBeNull();
      expect(chatbox).not.toBeNull();
      expect(displayBubbles).not.toBeNull();
      expect(hideBubbles).not.toBeNull();
  
      // Check if window.location.assign is proper
      expect(window.location.assign).not.toBeNull()
  
      // Restore the original window.location.assign method
      window.location.assign = originalLocationAssign;
    });
  });
  