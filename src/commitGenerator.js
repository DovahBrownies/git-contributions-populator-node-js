const { randomBytes } = require('crypto');
const fs = require('fs');
const path = require('path');

class CommitGenerator {
    constructor(simpleGit) {
        this.git = simpleGit;
    }

    async validateBranch(branchName) {
        const branches = await this.git.branch();
        return branches.all.includes(branchName);
    }

    async createCommits(repoPath, branchName, startDate, endDate, minCommitsPerDay, maxCommitsPerDay, commitChances, commitMessage = 'Automated commit') {
        console.log(`[CG] Checking out branch: ${branchName}`);
        await this.git.checkout(branchName);

        const filePath = path.join(repoPath, 'commit-file.txt');

        let currentDate = new Date(startDate);
        const end = new Date(endDate);

        while (currentDate <= end) {
            const day = currentDate.getDay();
            const chance = commitChances[day];

            if (Math.random() * 100 < chance) {
                const numCommits = Math.floor(Math.random() * (maxCommitsPerDay - minCommitsPerDay + 1)) + minCommitsPerDay;
                for (let i = 0; i < numCommits; i++) {
                    const randomMessage = `${commitMessage} ${randomBytes(4).toString('hex')}`;
                    const currentDateFormatted = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(currentDate);
                    console.log(`[CG] ${randomMessage} on ${currentDateFormatted}`);
                    
                    // Erase the file content before modifying it
                    fs.writeFileSync(filePath, '');

                    // Modify the file content
                    fs.writeFileSync(filePath, `Commit on ${currentDate.toISOString()} with message: ${randomMessage}\n`, { flag: 'a' });

                    // Stage changes before committing
                    await this.git.add(filePath);
                    await this.git.commit(randomMessage, {
                        '--date': currentDate.toISOString()
                    });
                }
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        console.log('[CG] Finished!');
    }
}

module.exports = CommitGenerator;