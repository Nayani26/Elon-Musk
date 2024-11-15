const mockJobs = [
    { title: 'Data Analyst', description: 'Analyze data to help make strategic decisions.', skills: 'data analysis, SQL, Python, Excel', location: 'India', postedDate: new Date('2024-11-01') },
    { title: 'Full-Stack Developer', description: 'Develop end-to-end web applications.', skills: 'JavaScript, React, Node.js, MongoDB, CSS', location: 'USA', postedDate: new Date('2024-10-29') },
    { title: 'Data Scientist', description: 'Build predictive models and data pipelines.', skills: 'Python, R, machine learning, data visualization', location: 'India', postedDate: new Date('2024-10-25') },
    { title: 'DevOps Engineer', description: 'Automate and optimize CI/CD processes.', skills: 'Docker, Kubernetes, AWS, Jenkins', location: 'USA', postedDate: new Date('2024-10-20') },
    // Add other jobs as needed
];

function getJobRecommendations() {
    const skillsInput = document.getElementById('skills').value.toLowerCase().trim();
    const locationInput = document.getElementById('location').value;
    const timePostedInput = parseInt(document.getElementById('timePosted').value);

    const keywords = skillsInput.split(',').map(keyword => keyword.trim()).filter(keyword => keyword);
    const currentDate = new Date();

    const recommendedJobs = mockJobs.filter(job => {
        const matchesKeyword = keywords.length === 0 || keywords.some(keyword =>
            job.title.toLowerCase().includes(keyword) ||
            job.description.toLowerCase().includes(keyword) ||
            job.skills.toLowerCase().includes(keyword)
        );

        const matchesLocation = !locationInput || job.location === locationInput;
        const matchesTimePosted = !timePostedInput || 
            (currentDate - job.postedDate) / (1000 * 60 * 60 * 24) <= timePostedInput;

        return matchesKeyword && matchesLocation && matchesTimePosted;
    });

    displayJobs(recommendedJobs);
}

function displayJobs(jobs) {
    const jobList = document.getElementById('job-list');
    jobList.innerHTML = '';

    if (jobs.length === 0) {
        jobList.innerHTML = '<p>No job matches found for the entered criteria.</p>';
        return;
    }

    jobs.forEach(job => {
        const jobItem = document.createElement('div');
        jobItem.className = 'job-item';
        jobItem.innerHTML = `
            <strong>${job.title}</strong>
            <p>${job.description}</p>
            <p><em>Required Skills: ${job.skills}</em></p>
            <p><em>Location: ${job.location}</em></p>
            <p><em>Posted Date: ${job.postedDate.toDateString()}</em></p>
        `;
        jobList.appendChild(jobItem);
    });
}
