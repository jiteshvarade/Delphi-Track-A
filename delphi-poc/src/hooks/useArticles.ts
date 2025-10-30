export interface Article {
  id: string
  title: string
  snippet: string
  content: string
}

export function useArticles(): Article[] {
  return [
    {
      id: '1',
      title: 'React (web framework)',
      snippet: 'React is a free and open-source front-end JavaScript library for building user interfaces.',
      content: `
        <h2>Notable features</h2>
        
        <h3>Declarative</h3>
        <p>React adheres to the declarative programming paradigm. Developers design views for each state of an application, and React updates and renders components when data changes. This is in contrast with imperative programming.</p>

        <h3>Components</h3>
        <p>React code is made of entities called components. These components are modular and can be reused. React applications typically consist of many layers of components. The components are rendered to a root element in the DOM using the React DOM library. When rendering a component, values are passed between components through props (short for "properties"). Values internal to a component are called its state.</p>
        <p>The two primary ways of declaring components in React are through function components and class components. Since React v16.8, using function components is the recommended way.</p>

        <h3>Function components</h3>
        <p>Function components, announced at React Conf 2018, and available since React v16.8, are declared with a function that accepts a single "props" argument and returns JSX. Function components can use internal state with the useState Hook.</p>

        <h3>React Hooks</h3>
        <p>On February 16, 2019, React 16.8 was released to the public, introducing React Hooks. Hooks are functions that let developers "hook into" React state and lifecycle features from function components. Notably, Hooks do not work inside classes — they let developers use more features of React without classes.</p>
        <p>React provides several built-in hooks such as useState, useContext, useReducer, useMemo and useEffect. Others are documented in the Hooks API Reference. useState and useEffect, which are the most commonly used, are for controlling state and side effects, respectively.</p>

        <h4>Rules of hooks</h4>
        <p>There are two rules of hooks which describe the characteristic code patterns that hooks rely on:</p>
        <ol>
          <li>"Only call hooks at the top level" — do not call hooks from inside loops, conditions, or nested statements so that the hooks are called in the same order each render.</li>
          <li>"Only call hooks from React functions" — do not call hooks from plain JavaScript functions so that stateful logic stays with the component.</li>
        </ol>
        <p>Although these rules cannot be enforced at runtime, code analysis tools such as linters can be configured to detect many mistakes during development. The rules apply to both usage of Hooks and the implementation of custom Hooks, which may call other Hooks.</p>

        <h3>Server components</h3>
        <p>React server components (RSC) are function components that run exclusively on the server. The concept was first introduced in the talk "Data Fetching with Server Components". Though a similar concept to Server Side Rendering, RSCs do not send corresponding JavaScript to the client as no hydration occurs. As a result, they have no access to hooks. However, they may be asynchronous functions, allowing them to directly perform asynchronous operations.</p>
        <p>Currently, server components are most readily usable with Next.js. With Next.js, it's possible to write components for both the server and the client (browser). When a server rendered component is received by the browser, React in the browser takes over and creates the virtual DOM and attach event handlers. This is called hydration.</p>
      `
    },
    {
      id: '2',
      title: 'Getting Started with TypeScript',
      snippet: 'TypeScript is a strongly typed programming language that builds on JavaScript.',
      content: `
        <h2>Introduction to TypeScript</h2>
        <p>TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.</p>
        
        <h3>Key Features</h3>
        <p>TypeScript adds optional static typing to JavaScript. This helps catch errors early in development and provides better IDE support.</p>
        
        <h3>Type Inference</h3>
        <p>TypeScript can infer types based on the values you assign, making it easier to get started without having to annotate every variable.</p>
        
        <h3>Interfaces and Types</h3>
        <p>TypeScript allows you to define custom types and interfaces to describe the shape of objects, making your code more predictable and easier to refactor.</p>
      `
    },
    {
      id: '3',
      title: 'Modern Web Development Best Practices',
      snippet: 'Learn the essential best practices for building modern web applications.',
      content: `
        <h2>Best Practices Overview</h2>
        <p>Modern web development involves many considerations from performance to accessibility and security.</p>
        
        <h3>Performance Optimization</h3>
        <p>Optimize your application by minimizing bundle sizes, using code splitting, and implementing lazy loading where appropriate.</p>
        
        <h3>Accessibility</h3>
        <p>Ensure your application is accessible to all users by following WCAG guidelines and using semantic HTML.</p>
        
        <h3>Security</h3>
        <p>Implement security best practices such as input validation, secure authentication, and protecting against common vulnerabilities like XSS and CSRF.</p>
        
        <h3>Testing</h3>
        <p>Write comprehensive tests including unit tests, integration tests, and end-to-end tests to ensure code quality and prevent regressions.</p>
      `
    }
  ]
}
