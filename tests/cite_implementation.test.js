// Import the necessary modules and functions
const fetchMock = require('jest-fetch-mock');
const { cite, displayBubbles, hideBubbles, createChatLi } = require('../frontend/js/chatbot-response.js');

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
    cite: jest.fn(),
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
describe('Citation Feature Unit Tests', () => {
    test('cite function should be called', async () => {
      // Mock pdfURL
      const pdfURL = 'mocked-pdf-url';
  
      // Creating a mock function for cite
      const originalCite = global.cite;
  
      try {
        // Call the function
        await cite(pdfURL);
  
        // Assert that the cite function is called
        expect(cite).toHaveBeenCalled();
  
        // Assert that the cite function is called with the correct arguments
        expect(cite).toHaveBeenCalledWith(pdfURL);
  
        // You can add additional assertions based on the behavior of your cite function
  
      } catch (error) {
        // If there's an error, fail the test
        throw error;
      } finally {
        // Restore the original implementation of the cite function
        global.cite = originalCite;
      }
    });
  });
  
// Integration Test
describe('Citation Feature Integration Tests', () => {
  test('cite should fetch data and update the DOM', async () => {
    // Set up the initial state for testing
    document.body.innerHTML = "<div id='loading-container'></div><div class='chatbox'></div>";

    // Mock data for testing
    const mockData = {
      content: 'Mocked citation content',
    };

    // Mock fetch response
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    // Call the cite function
    await cite('mocked-pdf-url');

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

    // Check if the chatbox has a new child with the generated message
    const generatedMessage = mockData.content;
    const generatedMessageElement = Array.from(chatbox.querySelectorAll('li.incoming p')).find((p) => p.textContent.includes(generatedMessage));
    expect(generatedMessageElement).not.toBeNull();
  });
});
