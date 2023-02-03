# Infocenter V2 FE
## Built from scratch using the following:
1. Snowpack
2. React v17
3. Typescript
4. Apollo Graphql

## Prerequisites
1. Node v12 or higher
2. [Yarn Package manager](https://yarnpkg.com/getting-started)
3. Infocenter 2.0 API

## Getting Started 
1. Run `yarn` to install dependencies
2. Run the graphql backend, API is served on localhost:4000
2. Run `yarn start` to start the React web app. App will be served on [localhost:8080](http://localhost:8080) App will hot reload when changes are saved. 

## Development Process
1. Create a branch from master. The naming convention should be either:
	<br/>`feature/<ticket name>` or `feature/<description if no ticket>`
	<br/>`hotfix/<ticket name>` or `hotfix/<description if no ticket>`

2a. Follow TDD Practices as best as possible. 

	- Useful links: Jest: https://jestjs.io/docs/api
	- React Testing Library: https://testing-library.com/docs/react-testing-library/api

2b. We Use Storybook to develop components, run `yarn storybook` to run the storybook server


3. Push Code through pipeline and Create a P.R for it. 

4. If your code passes Pipeline, get someone to review your code. 


