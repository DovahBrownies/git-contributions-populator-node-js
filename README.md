# Git Contributions Populator (Commit Generator)

## Overview
This app just lets you generate commits to populate your weak and sad contributions chart.

**Although there are a few very well written projects that do the same thing, I wanted to make something that was easier to use and, hopefully, I've achieved that with this project.**

**This is you:**

![empty-chart](https://github.com/user-attachments/assets/cece8d5e-3ae9-46ca-9c85-90a3642093c3)

**This is the dev your employer tells you not to worry about:**

![full-chart](https://github.com/user-attachments/assets/6adcef20-8012-47a5-bec0-c88a548c436a)

## Other Inspirations
Honestly, I pretty much made this because I've noticed that a lot of companies use your contribution chart as a serious metric of how good of a developer you are.

That really isn't an accurate way of measuring productivity and skills. Some of the best developers I know go days without committing anything because they're providing consultation, coordinating teams, assisting other developers, and so on...

And yet, if you're not pumping a bunch of commits, into GitHub, every day, some uninformed executive is going to think you absoilutely suck at your job.

[Now tell me, does that make any sense to you?](https://youtu.be/hzs5xSxLk5A?start=158&end=t=162)

## Installation
Just clone this here repository and run `npm i`.

## Usage
1. Create a new GitHub repository and create a local directory with a matching repo name.
2. Copy the entire command block under "*…or create a new repository on the command line*" and execute the command in your local repository. If you run `git log` in this repo now, there should be a single commit.
3. Open the terminal and navigate to this project directory.
4. Run the application:
   ```
   node src/index.js
   ```
5. Follow the prompts to enter the branch name, date range, commit frequency, and day selection. be sure to choose the correct path to your local repository.
6. Once the commits have been generated, just push your local repository to the origin.

![image](https://github.com/user-attachments/assets/fc51b8ba-6d70-417f-8c5f-4f3a5f30748b)

### Commit Generation Mechanics
- Commits are generated every day between the specified start and end dates.
- The actual number of commits per day depends on two factors:
  1. The set 'chance' for each day of the week. If you set Monday at 50%, then there's a 50% chance of a commit being generated on that day. All or nothing.
  2. The number of commits made on that day will be a random number between the specified minimum and maximum commits per day.
- Commit messages will be random strings.

## Contributing
I wrote this project in about *checks watch* 3 hours total. It may not be perfect but I enjoyed doing it and it works as intended.

If you think you're better than me and write better code than me, then show me what you got and open a PR.

![YTYBTM?](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjkzOTJkNHFha2llcHVrcTRwMG43Y20xanE0dzR2Nmk1cTB1ZTR3bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/0ANYpzlcagZ3AgYlui/giphy.gif)

Seriously though; Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the ISC License. Essentially... Just do whatever you want.
