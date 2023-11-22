const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.resolve(__dirname, '../frontend/public/chatbot.html'), 'utf8');

let dom;
let container;

beforeEach(() => {
  dom = new JSDOM(html, { runScripts: 'dangerously' });
  container = dom.window.document.documentElement;
});

test('Renders without crashing', () => {

    // header testing
    expect(container.querySelector('#home_button a').getAttribute('href')).toBe('index.html');
    expect(container.querySelector('#home_button a img').getAttribute('src')).toBe('../images/home-icon-purple.png');
    expect(container.querySelector('#header_search input').placeholder).toBe('Search for papers...');
    expect(container.querySelector('#about_button a').textContent).toBe('About');
    expect(container.querySelector('#about_button a').getAttribute('href')).toBe('about.html');

    // title testing
    expect(container.querySelector('title').textContent).toBe('Chatbot');
    // chatbot button testing
    expect(container.querySelector('#summarization').toBeTruthy());
    expect(container.querySelector('#citation').toBeTruthy());
    expect(container.querySelector('#similar-papers').toBeTruthy());
    // welcomeMessage testing
    const welcomeMessage = document.querySelector('.chatbox li p');
    expect(welcomeMessage).toBeTruthy();
    expect(welcomeMessage.textContent).toContain('Welcome!');
    // chatbot user field testing
    const userInputField = document.getElementById('user-input');
    const sendButton = document.getElementById('send');
    expect(userInputField).toBeTruthy();
    expect(sendButton).toBeTruthy();
    expect(userInputField.getAttribute('type')).toBe('text');
    // testing that loadingContainer is initially hidden
    const loadingContainer = document.getElementById('loading-container');
    expect(loadingContainer.style.display).toBe('none');
    // testing for chatbot-response.js is linked
    const scriptTag = document.querySelector('script[src="../js/chatbot-response.js"]');
    expect(scriptTag).toBeTruthy();
    expect(scriptTag.getAttribute('type')).toBe('module');
    expect(scriptTag.getAttribute('defer')).toBe('');

    // testing for chatbot.css and chatbot.js is linked
    expect(container.querySelector('meta[name="viewport"]').getAttribute('content')).toBe('width=device-width, initial-scale=1.0');
    expect(container.querySelector('link[rel="stylesheet"]').getAttribute('href')).toBe('../css/chatbot.css');
    expect(container.querySelector('script').getAttribute('src')).toBe('../js/chatbot.js');
});
