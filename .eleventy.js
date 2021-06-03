require('dotenv').config()

module.exports = (config) => {
	const ErrorOverlay = require('eleventy-plugin-error-overlay')
	const sortByDisplayOrder = require('./src/utils/sort-by-display-order.js')
	// Filters
	const dateFilter = require('./src/filters/date-filter.js')
	const w3DateFilter = require('./src/filters/w3-date-filter.js')
	const rssPlugin = require('@11ty/eleventy-plugin-rss')

	// Add filters
	config.addFilter('dateFilter', dateFilter)
	config.addFilter('w3DateFilter', w3DateFilter)

	// Plugins
	config.addPlugin(rssPlugin)
	config.addPlugin(ErrorOverlay)

	// Transforms
	const htmlMinTransform = require('./src/transforms/html-min-transform.js')

	// Create a helpful production flag
	const isProduction = process.env.NODE_ENV === 'production'

	// Only minify HTML if we are in production because it slows builds _right_ down
	if (isProduction) {
		config.addTransform('htmlmin', htmlMinTransform)
	}

	// Set directories to pass through to the dist folder
	//config.addPassthroughCopy('./src/images/')
	config.addPassthroughCopy('./src/robots.txt')
	config.addPassthroughCopy('./src/fonts/')
	config.addPassthroughCopy('./src/js/')
	config.addPassthroughCopy({
		'./strapi-api/public/uploads': 'uploads',
	})
	// Tell 11ty to use the .eleventyignore and ignore our .gitignore file
	config.setUseGitIgnore(false)

	return {
		markdownTemplateEngine: 'njk',
		dataTemplateEngine: 'njk',
		htmlTemplateEngine: 'njk',
		dir: {
			input: 'src',
			output: 'dist',
			data: '_data',
		},
		jsDataFileSuffix: '.data',
	}
}
