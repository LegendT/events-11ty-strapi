const fetch = require('node-fetch')

// function to get speakers
async function getAllSpeakers() {
	// max number of records to fetch per query
	const recordsPerQuery = 100

	// number of records to skip (start at 0)
	let recordsToSkip = 0

	let makeNewQuery = true

	let speakers = []

	// make queries until makeNewQuery is set to false
	while (makeNewQuery) {
		try {
			// initiate fetch
			const data = await fetch('http://127.0.0.1:1337/graphql', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					query: `{
						speakers {
							id
							title
							slug
							job
							about
							image {
								url
							}
							talkTimeStart
							talkTimeEnd
							talkDetails
							talkSummary
							imageAlt
							displayOrder
							}
          				}`,
				}),
			})

			// store the JSON response when promise resolves
			const response = await data.json()

			// handle CMS errors
			if (response.errors) {
				let errors = response.errors
				errors.map((error) => {
					console.log(error.message)
				})
				throw new Error('Houston... We have a CMS problem')
			}

			// update speakers array with the data from the JSON response
			speakers = speakers.concat(response.data.speakers)
			// console.log(speakers, speakers)
			// prepare for next query
			recordsToSkip += recordsPerQuery

			// stop querying if we are getting back less than the records we fetch per query
			if (response.data.speakers.length < recordsPerQuery) {
				makeNewQuery = false
			}
		} catch (error) {
			throw new Error(error)
		}
	}

	// format speakers objects
	const speakersFormatted = speakers.map((item) => {
		return {
			id: item.id,
			title: item.title,
			slug: item.slug,
			job: item.job,
			about: item.about,
			image: item.image,
			talkTimeStart: item.talkTimeStart,
			talkTimeEnd: item.talkTimeEnd,
			talkDetails: item.talkDetails,
			talkSummary: item.talkSummary,
			imageAlt: item.imageAlt,
			displayOrder: item.displayOrder,
		}
	})
	// return formatted speakers
	return speakersFormatted
}
module.exports = getAllSpeakers
