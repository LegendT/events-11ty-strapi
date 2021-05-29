const fetch = require('node-fetch')

// function to get sponsors
async function getAllSponsors() {
	// max number of records to fetch per query
	const recordsPerQuery = 100

	// number of records to skip (start at 0)
	let recordsToSkip = 0

	let makeNewQuery = true

	let sponsors = []

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
						sponsors {
							id
							sponsorLevel
							sponsorName
							website
							logo {
								url
							}
							logoAltText
							summary
							text
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

			// update sponsors array with the data from the JSON response
			sponsors = sponsors.concat(response.data.sponsors)
			// console.log(sponsors, sponsors)
			// prepare for next query
			recordsToSkip += recordsPerQuery

			// stop querying if we are getting back less than the records we fetch per query
			if (response.data.sponsors.length < recordsPerQuery) {
				makeNewQuery = false
			}
		} catch (error) {
			throw new Error(error)
		}
	}

	// format sponsors objects
	const sponsorsFormatted = sponsors.map((item) => {
		return {
			id: item.id,
			sponsorLevel: item.sponsorLevel,
			sponsorName: item.sponsorName,
			website: item.website,
			logo: item.logo.url,
			logoAltText: item.logoAltText,
			summary: item.summary,
			text: item.text,
			displayOrder: item.displayOrder,
		}
	})

	// return formatted sponsors
	return sponsorsFormatted
}
// export for 11ty
module.exports = getAllSponsors
