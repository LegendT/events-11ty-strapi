// Dynamic creation of speakers pages
const { spawn } = require('child_process')
const fetch = require('node-fetch')
const fs = require('fs')

const express = require('express')
const app = express()

const PORT = 3007
const STAPIURL = `http://localhost:1337`

const path = require('path')
const filendir = require('filendir')

const speakers = async () => {
	await fetch(`${STAPIURL}/speakers`)
		.catch((err) => {
			console.error(err)
		})
		.then((res) => res.json())
		.then((speakers) => {
			console.log(`Found ${speakers.length} speaker(s)`)

			for (const speaker of speakers) {
				const {
					title,
					slug,
					job,
					about,
					talkTimeStart,
					talkTimeEnd,
					image,
					imageAlt,
					talkDetails,
					talkSummary,
				} = speaker
				const content = `--- \ntitle: "${title}"\njob: "${job}"\nabout: "${about}"\ntalkTimeStart: "${talkTimeStart}"\ntalkTimeEnd: "${talkTimeEnd}"\nimage: "${image.url}"\nimageAlt: "${imageAlt}"\ntalkDetails: "${talkDetails}"\ntalkSummary: "${talkSummary}"\npermalink: "speakers/${slug}/index.html"\n---\n`

				try {
					// const filename = `${slug}.md`
					const filename = path.join('src', 'speakers', `${slug}.md`)
					console.log(`Writing ${filename}`)

					fs.writeFileSync(filename, content)
				} catch (err) {
					console.error(err)
				}
			}
		})
}

const init = async () => {
	await speakers()

	let watcher = spawn('npm', ['run', 'start'])

	watcher.stdout.on('data', (data) => {
		console.log(`${data}`)
	})

	app.use(express.static('_site'))

	app.get('/reload', async (req, res) => {
		await services()

		console.log('Rebuilding Eleventy')

		watcher.kill()

		watcher = spawn('npm', ['run', 'start'])

		watcher.stdout.on('data', (data) => {
			console.log(`${data}`)
		})

		return res.sendStatus(200)
	})

	app.listen(PORT, () =>
		console.log(`Example app listening on port ${PORT}!`)
	)
}

init()
