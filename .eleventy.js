module.exports = (config) => {
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

	// Returns speaker items, sorted by display order
	config.addCollection('speakers', (collection) => {
		return sortByDisplayOrder(
			collection.getFilteredByGlob('./src/speakers/*.md')
		)
	})
	// Returns sponsors items, sorted by display order
	config.addCollection('sponsors', (collection) => {
		return sortByDisplayOrder(
			collection.getFilteredByGlob('./src/sponsors/*.md')
		)
	})

	// Returns partners items, sorted by display order
	config.addCollection('partners', (collection) => {
		return sortByDisplayOrder(
			collection.getFilteredByGlob('./src/partners/*.md')
		)
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
		},
	}
}
