const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.resolve(__dirname, '../frontend/public/searchresults.html'), 'utf8');

let dom;
let container;

beforeEach(() => {
  dom = new JSDOM(html, { runScripts: 'dangerously' });
  container = dom.window.document.documentElement;

  // Reset container content
  container.innerHTML = '';
});

// Import the Jest test cases
const { searchArXiv, displayResults, saveHistory } = require('../frontend/js/searchresults.js');

// Mocking the fetch function for testing purposes
global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve('<xml>Mocked XML data</xml>'),
  })
);

// Mocking localStorage
global.localStorage = {
  getItem: jest.fn().mockReturnValue(null),
  removeItem: jest.fn(),
  setItem: jest.fn(),
};

// Mocking DOMParser
global.DOMParser = function () {
  return {
    parseFromString: jest.fn().mockReturnValue({
      querySelectorAll: jest.fn(() => []),
    }),
  };
};

// Mocking document and its methods
global.document = dom.window.document;
global.window = dom.window;

describe('searchArXiv', () => {
  test('searchArXiv should fetch data from ArXiv API and parse XML', async () => {
    await searchArXiv('test', 5);

    // Check if the fetch function was called
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('https://export.arxiv.org/api/query'));

    // Check if the DOMParser was called
    expect(global.DOMParser().parseFromString).toHaveBeenCalledWith('<xml>Mocked XML data</xml>', 'text/xml');
  });
});

describe('displayResults', () => {
  test('displayResults should render results correctly on the HTML page', () => {
    // Mocking the HTML elements using the container
    container.innerHTML = `
      <div id="search-results-container"></div>
      <div id="article-button-container"></div>
    `;

    const results = [
      { title: 'Test Title 1', summary: 'Summary 1', authors: 'Author 1', link: 'http://example.com/1' },
      { title: 'Test Title 2', summary: 'Summary 2', authors: 'Author 2', link: 'http://example.com/2' },
    ];

    displayResults(results);

    // Check if the results are rendered correctly using the container instead of document
    expect(container.querySelectorAll('.results-div')).toHaveLength(results.length);
    expect(container.querySelectorAll('.hyperlink-style')).toHaveLength(results.length);
    expect(container.querySelectorAll('.article-icons')).toHaveLength(results.length);
  });
});

describe('saveHistory', () => {
  test('saveHistory should update localStorage with new paper information', () => {
    // Mocking the current date
    const mockDate = new Date('2023-01-01T12:00:00.000Z');
    global.Date = jest.fn(() => mockDate);

    saveHistory('Test Paper', 'http://example.com/paper', 'John Doe');

    // Check if localStorage.setItem was called with the correct data
    expect(global.localStorage.setItem).toHaveBeenCalledWith(
      'paperHistory',
      JSON.stringify([['Test Paper', 'http://example.com/paper', 'John Doe', '2023-01-01, 12:00:00']])
    );
  });
});
