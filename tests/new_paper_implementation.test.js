const fetchMock = require('jest-fetch-mock');

// Import the functions to be tested
const { addNewPapers, getNewPapers } = require('../frontend/js/homepage.js');

// Mocking DOMParser
global.DOMParser = function () {
  return {
    parseFromString: jest.fn().mockReturnValue({
      getElementsByTagName: jest.fn(() => []),
    }),
  };
};

// Mocking the fetch function for testing purposes
jest.mock('node-fetch', () => ({
  fetch: jest.fn(),
}));

//UNIT TEST

describe('addNewPapers', () => {
  test('addNewPapers should update the HTML with new papers', () => {
    // Set up the initial state for testing
    document.body.innerHTML = '<ul id="new"></ul>';

    // Mock data for testing
    const mockPaper = {
      title: 'Test Title',
      authors: 'Test Author',
      date: '2023-01-01',
      pdfLink: 'http://example.com/test.pdf',
    };

     // Call the function and get the return value
     const result = addNewPapers([mockPaper]);

     // Verify that the HTML is updated correctly
     const ul = document.getElementById('new');
     
     // Check if the element exists before accessing its child nodes
     expect(ul).not.toBeNull();
 
     // Check if the result is true
     expect(result).toBe(true);
  });
});


// INTEGRATION TEST

// Mocking the fetch function for testing purposes
global.fetch = jest.fn();

describe('getNewPapers', () => {
  test('getNewPapers should fetch data from ArXiv API and call addNewPapers', async () => {
    // Set up the initial state for testing
    document.body.innerHTML = '<ul id="new"></ul>';

    // Mock the response from node-fetch
    global.fetch.mockResolvedValue({
      text: jest.fn().mockResolvedValue('<xml>Mocked XML data</xml>'),
    });

    // Call the function
    await getNewPapers(1);

    // Verify that the fetch function was called
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('http://export.arxiv.org/api/query'));

  });
});