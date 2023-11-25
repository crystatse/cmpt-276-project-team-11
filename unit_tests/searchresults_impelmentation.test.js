const fetchMock = require('jest-fetch-mock');

// Import the functions to be tested
const { searchArXiv, displayResults } = require('../frontend/js/searchresults.js');

// Mocking DOMParser within the module being tested
jest.mock('../frontend/js/searchresults.js', () => {
  const originalModule = jest.requireActual('../frontend/js/searchresults.js');
  return {
    ...originalModule,
    DOMParser: {
      parseFromString: jest.fn().mockReturnValue({
        getElementsByTagName: jest.fn(() => []),
      }),
    },
  };
});

// Mocking the fetch function for testing purposes
jest.mock('node-fetch', () => ({
  fetch: jest.fn(),
}));

// TEST TEST
describe('test', () => {
  test('test', () => {
    // Set up the initial state for testing
    expect(searchArXiv).toBeInstanceOf(Function);
  });
});

// UNIT TESTING

// ARXIV ID SEARCH UNIT TEST

describe('searchArXiv', () => {
  test('searchArXiv with ID', async () => {
    // Set up the initial state for testing
    const search = "arXiv:1802.07361v1"; // random arXiv ID
    const result = await searchArXiv(search, 1);
    expect(result).toEqual(expect.any(Array));
  });
});

// ARXIV KEYWORD SEARCH UNIT TEST

describe('searchArXiv', () => {
  test('searchArXiv with AND Keywords', async () => {
    // Set up the initial state for testing
    const search = "HTML AND Ai";
    const result = await searchArXiv(search, 1);
    expect(result).toEqual(expect.any(Array));
  });
  test('searchArXiv with OR Keywords', async () => {
    // Set up the initial state for testing
    const search = "HTML OR Ai";
    const result = await searchArXiv(search, 1);
    expect(result).toEqual(expect.any(Array));
  });
  test('searchArXiv with NOT Keywords', async () => {
    // Set up the initial state for testing
    const search = "HTML NOT Ai";
    const result = await searchArXiv(search, 1);
    expect(result).toEqual(expect.any(Array));
  });
});

// ARXIV METADATA RETRIEVAL UNIT TEST

describe('searchArXiv', () => {
  test('searchArXiv returns metadata', async () => {
    // Set up the initial state for testing
    const search = "HTML"; // random arXiv entry
    const result = await searchArXiv(search, 1);
    expect(result).toEqual(expect.any(Array));

    // Check properties of each element in the array
    result.forEach(entry => {
      expect(entry).toHaveProperty('title');
      expect(entry.title).not.toBeUndefined();
      expect(entry.title).not.toBe('');

      expect(entry).toHaveProperty('summary');
      expect(entry.summary).not.toBeUndefined();
      expect(entry.summary).not.toBe('');

      expect(entry).toHaveProperty('authors');
      expect(entry.authors).not.toBeUndefined();
      expect(entry.authors).not.toBe('');

      expect(entry).toHaveProperty('link');
      expect(entry.link).not.toBeUndefined();
      expect(entry.link).not.toBe('');
    });
  });
});
// INTEGRATION TESTING

// SEARCH RESULTS INTEGRATION TEST

global.fetch = require('jest-fetch-mock');

describe("searchArXiv", () => {
  test("searchArXiv should fetch data from ArXiv API and call displayResults", async () => {
    // Set up the initial state for testing
    document.body.innerHTML = "<div id='article-container'><div id='article-button-container'></div><div id='search-results-container'></div></div>";

    // Call the searchArXiv function
    await searchArXiv("test", 1);

    const articleContainer = document.getElementById('article-container');
    const articleButtonContainer = document.getElementById('article-button-container');
    const searchResultsContainer = document.getElementById('search-results-container');

    // Check if the element exists
    expect(articleContainer).not.toBeNull();
    expect(articleButtonContainer).not.toBeNull();
    expect(searchResultsContainer).not.toBeNull();

    expect(articleContainer.children.length).toBeGreaterThan(0);

  });
});

