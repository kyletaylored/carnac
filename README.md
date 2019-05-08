# Carnac

> A magic machine that runs a trend analysis on selected Reddit subs.

![Reddit Trend Analyzer](https://github.com/kyletaylored/carnac/raw/master/static/reddit%20trend%20analyzer.jpg)

The above is a mind map of how this tool will ideally work. After selecting a series of related (or not!) subreddits, the tool will extract metadata from each post, and run that data through Google's Natural Language Processing tool to get information such as sentiment and content categorization. It will also extract keywords and phrases, which then later we can use to compare and create trend reports. 

Below is a mockup of the list dashboard.

![Carnac Dashboard](https://github.com/kyletaylored/carnac/raw/master/static/dashboard-outline.jpg)
# Getting Started

> Run: npm install -D

1. Create Reddit account
    1. Create Reddit app -> https://ssl.reddit.com/prefs/apps/
    2. Select "script" as the type of app to create and give it a name.
    3. Name the app a meaningful name.
    4. Set redirector url to "http://localhost:8080"
    5. Finalize Creation of the app and save the app ID and secret for later environment configuration.
2. Create a Google NLP service account
    1. https://support.google.com/a/answer/7378726?hl=en
3. Setup environment variables for user authentication
    1. Create a .env file in the root directory.
    2. In the new .env file, add fields for CLIENT_ID, CLIENT_SECRET, REDDIT_USER, AND REDDIT_PASS, where you will set each variable equal to the Reddit app ID, secret, Reddit username, and Reddit password respectively. The .env file will manage your credentials for node server  authentication against the Reddit API and Google Natural Language Processing API.
    2. "Placeholder for setting up .env file with Google NLP Credentials"