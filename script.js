// https://cors-anywhere.herokuapp.com/corsdemo

document.addEventListener("DOMContentLoaded", function () {
    // Get references to the DOM elements
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

    // Function to validate the username entered by the user
    function validateUsername(username) {
        // Check if username is empty
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        // Regex to ensure the username follows LeetCode username rules
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid Username"); // Show error if the username doesn't match the pattern
        }
        return isMatching;
    }

    // Function to fetch the user's details from LeetCode API
    async function fetchUserDetails(username) {

        try {
             // Change button text and disable while fetching data
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            //statsContainer.classList.add("hidden");
            // const response = await fetch(url);

            // Define the GraphQL request for fetching LeetCode user stats
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
            const targetUrl = 'https://leetcode.com/graphql/';

            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/json");

            const graphql = JSON.stringify({
                query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                variables: { "username": `${username}` }
            })
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
            };

            // Fetch data from LeetCode
            const response = await fetch(proxyUrl + targetUrl, requestOptions);

            // Check if the response is successful
            if (!response.ok) {
                throw new Error("Unable to fetch the User details");
            }
            // Parse the JSON data
            const parsedData = await response.json();
            console.log("Logging data: ", parsedData);

            // Call function to display fetched user data
            displayUserData(parsedData);
        }
        catch (error) {
            // If there's an error, display the message
            statsContainer.innerHTML = `<p>${error.message}</p>`
        }
        finally {
            // Reset the search button text and re-enable it
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    // Function to update the progress indicators (Easy, Medium, Hard)
    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100; // Calculate percentage of progress
        circle.style.setProperty("--progress-degree", `${progressDegree}%`); // Update progress circle style
        label.textContent = `${solved}/${total}`; // Update the label with solved/total count
    }

    // Function to display the user's stats after fetching
    function displayUserData(parsedData) {
        // Extract total and solved questions data for each difficulty level
        const totalQues = parsedData.data.allQuestionsCount[0].count;
        const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
        const totalMediumQues = parsedData.data.allQuestionsCount[2].count;
        const totalHardQues = parsedData.data.allQuestionsCount[3].count;

        const solvedTotalQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedTotalEasyQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedTotalMediumQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedTotalHardQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

        // Update progress circles for each difficulty level
        updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);

        // Prepare data for the cards displaying the overall submissions
        const cardsData = [
            { label: "Overall Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions },
            { label: "Overall Easy Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions },
            { label: "Overall Medium Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions },
            { label: "Overall Hard Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions },
        ];

        console.log("card's data: ", cardsData);

        // Dynamically generate cards displaying the submission stats
        cardStatsContainer.innerHTML = cardsData.map(
            data =>
                `<div class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                    </div>`
        ).join("") // Join all card HTML strings together

    }

    // Event listener for the search button to trigger the username validation and data fetching
    searchButton.addEventListener('click', function () {
        const username = usernameInput.value; // Get the username entered by the user
        console.log("logggin username: ", username);
        if (validateUsername(username)) { // Validate username before fetching details
            fetchUserDetails(username); // If valid, fetch user details
        }
    })

    // Dynamically update the copyright year in the footer
    const year = new Date().getFullYear();
    document.querySelector('footer p').textContent = `© ${year} Devansh Narayan Singh. All Rights Reserved.`;
})

// https://cors-anywhere.herokuapp.com/corsdemo