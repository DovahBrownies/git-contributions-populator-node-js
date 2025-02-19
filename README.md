# Commit Generator App

## Overview
The Commit Generator App is a Node.js application that allows users to generate commits in a specified Git branch based on user-defined parameters. Users can specify the branch name, date range, commit frequency, and select specific days for commits.

## Features
- Generate commits in a specified branch.
- Define a date range for commit generation.
- Set commit frequency (daily, weekly, etc.).
- Select specific days of the week for commits.

## Project Structure
```
commit-generator-app
├── src
│   ├── index.js
│   ├── commitGenerator.js
│   └── utils
│       └── dateUtils.js
├── package.json
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd commit-generator-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
1. Open the terminal and navigate to the project directory.
2. Run the application:
   ```
   node src/index.js
   ```
3. Follow the prompts to enter the branch name, date range, commit frequency, and day selection.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the ISC License.