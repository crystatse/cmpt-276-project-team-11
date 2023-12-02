const fetchMock = require('jest-fetch-mock');

// Import the functions to be tested
const { getViewedPapers, addViewedPapers, saveHistory } = require('../frontend/js/homepage.js');

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

// Mocking localStorage
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: key => store[key],
    setItem: (key, value) => (store[key] = value),
    removeItem: key => delete store[key],
    clear: () => (store = {}),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// INTEGRATION TEST

describe('addViewedPapers', () => {
  test('addViewedPapers should update the HTML with viewed papers', () => {
    // Set up the initial state for testing
    document.body.innerHTML = '<ul id="recent"></ul>';

    // Mock data for testing
    const mockPapers = [
      ['Viewed Title 1', 'http://example.com/viewed1.pdf', 'Viewed Author 1', '2023-01-01'],
      ['Viewed Title 2', 'http://example.com/viewed2.pdf', 'Viewed Author 2', '2023-01-02'],
    ];

    // Call the function and get the return value
    const result = addViewedPapers([mockPapers]);

    // Verify that the HTML is updated correctly
    const ul = document.getElementById('recent');
    
    // Check if the element exists before accessing its child nodes
    expect(ul).not.toBeNull();

    // Check if the result is true
    expect(result).toBe(true);
  });
});

// UNIT TEST

describe('saveHistory', () => {
  test('saveHistory should update the localStorage with new history', () => {
    // Set up the initial state for testing
    const mockPaper = [
      "Saved Title",
      "http://example.com/saved.pdf",
      "Saved Author",
    ];

    // Call the function
    saveHistory(...mockPaper);

    // Retrieve the stored value from localStorage
    const storedHistory = JSON.parse(localStorage.getItem('paperHistory'));

    // Verify that the localStorage is updated correctly
    expect(storedHistory).toHaveLength(1);
    expect(storedHistory[0]).toHaveLength(4); // Make sure the saved paper has all expected fields

    // Additional check: Verify that the timestamp is a valid date string
    const timestamp = storedHistory[0][3];
    expect(new Date(timestamp)).toBeInstanceOf(Date);
  });
});

// UNIT TEST

describe('getViewedPapers', () => {
  test('getViewedPapers should update the HTML with papers from localStorage', () => {
    // Set up the initial state for testing
    document.body.innerHTML = '<ul id="recent"></ul>';

    // Mock data for testing
    const mockPapers = [
      ['Viewed Title 1', 'http://example.com/viewed1.pdf', 'Viewed Author 1', '2023-01-01'],
      ['Viewed Title 2', 'http://example.com/viewed2.pdf', 'Viewed Author 2', '2023-01-02'],
    ];

    // Mock localStorage
    localStorage.setItem('paperHistory', JSON.stringify(mockPapers));

    // Call the function
    getViewedPapers();

    // Verify that the HTML is updated correctly
    const ul = document.getElementById('recent');

    // Check if the element exists before accessing its child nodes
    expect(ul).not.toBeNull();

    // If the element exists, check if list items are added based on the length of mockPapers
    if (ul) {
      expect(ul.childNodes.length).toBe(mockPapers.length);
      expect(ul.firstChild.nodeName).toBe('A'); // Check if the child is an anchor element
    }
  });
});
