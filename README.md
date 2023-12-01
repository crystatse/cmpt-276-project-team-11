## Project Overview
The goal of the project is to develop a web application that helps students with writing their research papers. This application will use AI to allow students to look for recently published papers, search for papers written by specific researchers, find papers similar to the ones they have used, and generate citations and bibliographies for their sources. In addition to accessing papers, AI will also be used to summarize and answer questions about the papers. This application aims to streamline the process of finding information for research by cutting down the time spent looking for relevant papers.  

## Technology Stack
For this project, we will be using HTML, CSS, and Javascript for the frontend components. NodeJS and Express will also be used for the server-side development. We chose this tech stack because of its established reliability, extensive ecosystem, seamless integration capabilities, and abundant online resources and documentation. It ensures a coherent and efficient development process, providing scalability, ease of development, and a robust foundation for integrating our APIs. 

## Contributors
This project was made by Crysta Tse, Gurveen Gill, Saif Ali, and Steven Ao.

Personal Github links:

Crysta: https://github.com/crystatse

Gurveen: https://github.com/gurveeng

Saif: https://github.com/safesaif21

Steven: https://github.com/Steven-Ao

## Chosen APIs
We will be using both ChatGPT API and ArXiv API.

The ChatGPT API was chosen for its cutting-edge natural language processing capabilities. This API has extensive documentation, which would undoubtedly serve as a comprehensive resource to work with as we integrate the API into our application. Furthermore, ChatGPT aligns with the core goals of our application with its ability to summarize text and answer questions about textual content. Its compatibility with Node.js is another reason we chose this API. 

The ArXiv API has been selected due to its extensive database of research papers. Furthermore, the ArXiv API seamlessly integrates with Node.js, affording us the capability to perform HTTP requests for access and retrieval of research papers. This compatibility allows us to grant users an extensive library of research materials within our application. 

## Features for each API
ChatGPT: 
- Generate concise and coherent summaries of research papers. 
- Using the API's natural language processing capabilities to provide detailed answers to user queries regarding the selected research paper, enhancing their understanding and engagement with the content. 
- Utilize ChatGPT to create prompts and recommendations that guide users to related research papers and suggest relevant keywords or search terms for further investigation. 
- Implement a feature that creates properly formatted citations for research papers, streamlining the referencing process for users. 

ArXiv: 
- Integrate the ArXiv API to enable users to retrieve a specific research paper using the paper’s unique ArXiv identifier. 
- Leverage the API to fetch comprehensive metadata for research papers, including details like title, authors, abstract, publication date, DOI, ArXiv ID, categories, license information, version, comments, links, and availability in various formats. 
- Enable users to search for and retrieve multiple research papers that match their desired keywords or search terms. 
- Retrieve recent papers using the ArXiv API to fetch a list of the most recently published papers. 
