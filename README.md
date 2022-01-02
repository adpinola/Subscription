# Subscription
Decentralized Application that uses a Smart Contract to allow/deny access to specific sections of the site

## Table of contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installing dependencies](#installing-dependencies)
  - [Running the application locally](#running-the-application-locally)
  - [Building the code](#building-the-code)
  - [Testing locally](#testing-locally)
- [Linting](#linting)
- [Contributing](#contributing)

## Getting Started

To get started developing for this projects, please clone the repo:

```bash
git clone https://github.com/adpinola/truco-live.git
```

### Prerequisites

These two tools are not included in the `package.json` file, so you will need to add them manually

- [Truffle](https://trufflesuite.com/truffle)
- [Ganache](https://trufflesuite.com/ganache/)
- [MetaMask](https://metamask.io/)

### Installing dependencies

If you don't have the modules installed, execute this inside the project directory

```bash
cd Subscription
npm install
```

### Running the application locally

To run the project locally for development purposes, follow these steps:

1. Open Ganache and start a blockchain.
2. Once it´s available, copy one of the 10 account adresses available and replace that value in the field `__LOCAL_ACCOUNT__` in the file `truffle-config.js`. This account will be used to deploy the contract in your local dev environment.
3. In MetaMask, add the Ganache network. check the port in the Ganache UI
4. Import the accounts using the MNEMONIC from Ganache.
5. In your terminal, run `npm run dev`. This will deploy the contract in the Ganache network and then will start the development server at port 3000

### Testing

This application uses Truffle to test the contract code. Run the following command.

```bash
npm run contract:test
```

This will open a window with a list of every .spec file that is in the `integration` folder. If you click on one of them, it will open another window of the selected browser and start its test. You can visually track every step of the testing process and get snapshots.

To run the tests in "headless" mode (without the visual interface), run the following

```bash
npm run cypress:all
```

## Linting

This project comes with three tools for checking code styles and syntax errors: [ESLint](https://eslint.org/),  [Prettier](https://prettier.io/) and [Solhint](https://www.npmjs.com/package/solhint). These are use to check both React and Contract code. 

To check your code with both tools, you have to run

```bash
npm run linter
```

To auto-fix the auto-fixable issues with both tools, execute this

```bash
npm run format
```

You can run the checkers and fixers separately.

Checking with ESLint

```bash
npm run lint:eslint
```

Checking with Prettier

```bash
npm run lint:prettier
```

Auto-fixing with ESLint

```bash
npm run format:eslint
```

Auto-fixing with Prettier

```bash
npm run format:prettier
```

The specific linter for solidity code is Solhint. Run this command to execute the check
```bash
npm run solhint
```

In fact, what `npm run linter` and `npm run format` do is just executing the ESLint checker (or fixer) and then the Prettier checker (or fixer)

## Contributing

If you feel to contribute to this project, please open a PR!