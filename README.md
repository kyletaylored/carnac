# Carnac

> A magic machine that runs a trend analysis on selected Reddit subs.

![Reddit Trend Analyzer](https://github.com/kyletaylored/carnac/raw/master/static/reddit%20trend%20analyzer.jpg)

The above is a mind map of how this tool will ideally work. After selecting a series of related (or not!) subreddits, the tool will extract metadata from each post, and run that data through Google's Natural Language Processing tool to get information such as sentiment and content categorization. It will also extract keywords and phrases, which then later we can use to compare and create trend reports. 

Below is a mockup of the list dashboard.

![Carnac Dashboard](https://github.com/kyletaylored/carnac/raw/master/static/dashboard-outline.jpg)
# Getting Started

> Run: npm install

> Run: npm install grpc --runtime=electron --target=<"current electron version">

1. Create a Google NLP service account
    1. https://support.google.com/a/answer/7378726?hl=en
2. Place Google NLP API key in APIkey.txt file
3. "Placeholder for setting up .env file with Google NLP Credentials"