# DJS04 Project Brief: Book Connect - Web Components

### Objective

Transform the book preview functionality of the "Book Connect" application into a fully operational Web Component. Additionally, evaluate and potentially convert other parts of the application into Web Components to enhance modularity and reusability.

### Goals

- **Convert Book Preview to Web Component**: The main focus is to encapsulate the book preview feature into a Web Component, making it reusable and independent.
- **Assess Other Components**: Identify other elements within the "Book Connect" app that could benefit from being converted into Web Components.
- **Maintain Functionality**: Ensure that the application retains all its current functionalities after refactoring.

### My Tasks

## Completed

1. **Understand the Existing Codebase**

2. **Create a Web Component for Book Preview**:

   - After several attempts I managed to implement a very simple encapsulation of the book previews function. The web component (found in the displayPreviewsConstructor.js file) shows the title, author, and image of the first book in the "books" array found in the data.js file.

   - I began the process of creating a self-contained component, with its own HTML, CSS, and JavaScript.
   - I tested the component to ensure it is connected to the DOM with an event listener that changes the color of the preview button and the font color (lines 81 - 89).

## In Progress

1. **Identify and Convert Other Components**:
   - Analyse the application to identify other potential components for conversion.
   - Prioritise components based on their reusability and importance to the app.
   - Convert the chosen elements into Web Components.
2. **Testing and Integration**:
   - Rigorously test the new components individually and within the context of the application.
   - Pay special attention to interactions between components and the overall user experience.
3. **Documentation**:
   - Document the process of creating the Web Components.
   - Include any challenges faced and how they were overcome.
   - Provide a clear guide on how the components should be used within the app.
