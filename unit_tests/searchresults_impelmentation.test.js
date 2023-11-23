const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Include the Jest testing framework
const jest = require('jest');

const html = fs.readFileSync(path.resolve(__dirname, '../frontend/public/searchresults.html'), 'utf8');

let dom;
let container;

beforeEach(() => {
  dom = new JSDOM(html, { runScripts: 'dangerously' });
  container = dom.window.document.documentElement;
});

// Import the Jest test cases
const { searchArXiv, displayResults, saveHistory } = require('./script');

// Mocking the fetch function for testing purposes
global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve('<xml>Mocked XML data</xml>'),
  })
);

describe('searchArXiv', () => {
  test('searchArXiv should fetch data from ArXiv API and parse XML', async () => {
    // Mocking localStorage
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(null),
      removeItem: jest.fn(),
    };
    global.localStorage = mockLocalStorage;

    // Mocking DOMParser
    global.DOMParser = function () {
      return {
        parseFromString: jest.fn().mockReturnValue({
          querySelectorAll: jest.fn(() => []),
        }),
      };
    };

    await searchArXiv('test', 5);

    // Check if the fetch function was called
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('https://export.arxiv.org/api/query'));

    // Check if the DOMParser was called
    expect(global.DOMParser().parseFromString).toHaveBeenCalledWith('<xml>Mocked XML data</xml>', 'text/xml');
  });
});

describe('displayResults', () => {
  test('displayResults should render results correctly on the HTML page', () => {
    // Mocking the HTML elements
    document.body.innerHTML = `
      <div id="search-results-container"></div>
      <div id="article-button-container"></div>
    `;

    const results = [
      { title: 'Test Title 1', summary: 'Summary 1', authors: 'Author 1', link: 'http://example.com/1' },
      { title: 'Test Title 2', summary: 'Summary 2', authors: 'Author 2', link: 'http://example.com/2' },
    ];

    displayResults(results);

    // Check if the results are rendered correctly
    expect(document.querySelectorAll('.results-div')).toHaveLength(results.length);
    expect(document.querySelectorAll('.hyperlink-style')).toHaveLength(results.length);
    expect(document.querySelectorAll('.article-icons')).toHaveLength(results.length);
  });
});

describe('saveHistory', () => {
  test('saveHistory should update localStorage with new paper information', () => {
    // Mocking the current date
    const mockDate = new Date('2023-01-01T12:00:00.000Z');
    global.Date = jest.fn(() => mockDate);

    // Mocking localStorage
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue('[]'),
      setItem: jest.fn(),
    };
    global.localStorage = mockLocalStorage;

    saveHistory('Test Paper', 'http://example.com/paper', 'John Doe');

    // Check if localStorage.setItem was called with the correct data
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'paperHistory',
      JSON.stringify([['Test Paper', 'http://example.com/paper', 'John Doe', '2023-01-01, 12:00:00']])
    );
  });
});
