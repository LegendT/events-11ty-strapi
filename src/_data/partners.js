const fetch = require('node-fetch')

// function to get speakers
async function getAllPartners() {
	// max number of records to fetch per query
	const recordsPerQuery = 100

	// number of records to skip (start at 0)
	let recordsToSkip = 0

	let makeNewQuery = true

	let partners = []

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
						partners {
							id
							partnerName
							website
							logo{
								url
							}
							logoAlt
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

			// update partners array with the data from the JSON response
			// partners = partners
			partners = partners.concat(response.data.partners)

			// prepare for next query
			recordsToSkip += recordsPerQuery

			// stop querying if we are getting back less than the records we fetch per query
			if (response.data.partners.length < recordsPerQuery) {
				makeNewQuery = false
			}
		} catch (error) {
			throw new Error(error)
		}
	}

	// format partners objects
	const partnersFormatted = partners.map((item) => {
		return {
			id: item.id,
			partnerName: item.partnerName,
			website: item.website,
			logo: item.logo.url,
			logoAlt: item.logoAlt,
			summary: item.summary,
			text: item.text,
			displayOrder: item.displayOrder,
		}
	})

	// return formatted partners
	return partnersFormatted
}
// export for 11ty
module.exports = getAllPartners
