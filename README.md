# Carnac

> A magic machine that runs a trend analysis on selected Reddit subs.

![Reddit Trend Analyzer](https://github.com/kyletaylored/carnac/raw/master/static/reddit%20trend%20analyzer.jpg)

The above is a mind map of how this tool will ideally work. After selecting a series of related (or not!) subreddits, the tool will extract metadata from each post, and run that data through Google's Natural Language Processing tool to get information such as sentiment and content categorization. It will also extract keywords and phrases, which then later we can use to compare and create trend reports. 

Below is a mockup of the list dashboard.

![Carnac Dashboard](https://github.com/kyletaylored/carnac/raw/master/static/dashboard-outline.jpg)

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# run unit & end-to-end tests
npm test


# lint all JS/Vue component files in `src/`
npm run lint

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[4c6ee7b](https://github.com/SimulatedGREG/electron-vue/tree/4c6ee7bf4f9b4aa647a22ec1c1ca29c2e59c3645) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
