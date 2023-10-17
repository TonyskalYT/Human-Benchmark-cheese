const puppeteer = require('puppeteer');
const fs = require('fs');
const {
	kill
} = require('process');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 80;

app.use(bodyParser.urlencoded({
	extended: false
}));

console.log(`Thank you for choosing TonyskalYT's Human Benchmark bypass. This script utalizes the node package Puppeteer to automate human responses, and HTML to locally host a site, which communicates back and fourth with the main javascript file and the HTML files. If you have any questions or concerns, contact me on Discord: TonyskalYT`)

app.use(express.static(__dirname));

async function HCU(username, password) {

	let u = "Invalid login data provided";

	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto('https://humanbenchmark.com/login');

	await page.waitForSelector('input[name="username"]');
	await page.type('input[name="username"]', username);

	await page.type('input[name="password"]', password);

	await page.click('input[type="submit"].css-z5gx6u.e19owgy712');
	await page.waitForNavigation();

	await page.waitForSelector('div[data-testid="username"]');
	u = await page.$eval('div[data-testid="username"]', (element) => element.textContent);

	browser.close();
	return u;
}

async function FUD(username, password) {

	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto('https://humanbenchmark.com/login');

	await page.waitForSelector('input[name="username"]');
	await page.type('input[name="username"]', username);

	await page.type('input[name="password"]', password);

	await page.click('input[type="submit"].css-z5gx6u.e19owgy712');
	await page.waitForNavigation();

	await page.waitForSelector('.css-ocvuti.e19owgy71', {
		visible: true
	});
	const hv = await page.$eval('.css-ocvuti.e19owgy71 p a', (link) => link.getAttribute('href'));

	await page.goto(`https://humanbenchmark.com${hv}/chimp`);
	await page.waitForSelector('div.big-number');
	const chimpscore = await page.$eval('div.big-number', (element) => element.textContent);
	await page.waitForSelector('div.percentile');
	const chimppercentile = await page.$eval('div.percentile', (element) => element.textContent);

	await page.goto(`https://humanbenchmark.com${hv}/sequence`);
	await page.waitForSelector('div.big-number');
	const sequencescore = await page.$eval('div.big-number', (element) => element.textContent);
	await page.waitForSelector('div.percentile');
	const sequencepercentile = await page.$eval('div.percentile', (element) => element.textContent);

	await page.goto(`https://humanbenchmark.com${hv}/typing`);
	await page.waitForSelector('div.big-number');
	const typingscore = await page.$eval('div.big-number', (element) => element.textContent);
	await page.waitForSelector('div.percentile');
	const typingpercentile = await page.$eval('div.percentile', (element) => element.textContent);

	await page.goto(`https://humanbenchmark.com${hv}/verbal-memory`);
	await page.waitForSelector('div.big-number');
	const verbalscore = await page.$eval('div.big-number', (element) => element.textContent);
	await page.waitForSelector('div.percentile');
	const verbalpercentile = await page.$eval('div.percentile', (element) => element.textContent);

	await page.goto(`https://humanbenchmark.com${hv}/memory`);
	await page.waitForSelector('div.big-number');
	const memoryscore = await page.$eval('div.big-number', (element) => element.textContent);
	await page.waitForSelector('div.percentile');
	const memorypercentile = await page.$eval('div.percentile', (element) => element.textContent);


	await page.goto(`https://humanbenchmark.com${hv}/aim`);
	await page.waitForSelector('div.big-number');
	const aimscore = await page.$eval('div.big-number', (element) => element.textContent);
	await page.waitForSelector('div.percentile');
	const aimpercentile = await page.$eval('div.percentile', (element) => element.textContent);

	await page.goto(`https://humanbenchmark.com${hv}/reactiontime`);
	await page.waitForSelector('div.big-number');
	const reactionscore = await page.$eval('div.big-number', (element) => element.textContent);
	await page.waitForSelector('div.percentile');
	const reactionpercentile = await page.$eval('div.percentile', (element) => element.textContent);

	await page.goto(`https://humanbenchmark.com${hv}/number-memory`);
	await page.waitForSelector('div.big-number');
	const numberscore = await page.$eval('div.big-number', (element) => element.textContent);
	await page.waitForSelector('div.percentile');
	const numberpercentile = await page.$eval('div.percentile', (element) => element.textContent);



	const chimptestresults = (`Chimp Test: ${chimpscore} points ${chimppercentile}`)
	const sequencetestresults = (`Sequence Memory Test: ${sequencescore} points ${sequencepercentile}`)
	const typingtestresults = (`Typing Test: ${typingscore} points ${typingpercentile}`)
	const verbaltestresults = (`Verbal Memory Test: ${verbalscore} points ${verbalpercentile}`)
	const visualtestresults = (`Visual Memory Test: ${memoryscore} points ${memorypercentile}`)
	const aimtestresults = (`Aim Test: ${aimscore} points ${aimpercentile}`)
	const reactiontestresults = (`Reaction Time Test: ${reactionscore} points ${reactionpercentile}`)
	const numbermemorytestresults = (`Number Memory Test: ${numberscore} points ${numberpercentile}`)

	browser.close();
	return {
		chimptestresults,
		sequencetestresults,
		typingtestresults,
		verbaltestresults,
		visualtestresults,
		aimtestresults,
		reactiontestresults,
		numbermemorytestresults
	};
}

app.post('/profile', async (req, res) => {
	const {
		username,
		password
	} = req.body;
	const configPath = 'config.json';
	const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));

	configData.username = username;
	configData.password = password;

	fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));

	const u = await HCU(username, password);
	const userData = await FUD(username, password);

	const loginHTML = fs.readFileSync('login.html', 'utf8');

	const dynamicHTML = loginHTML.replace('{{u}}', u)
		.replace('{{chimptestresults}}', userData.chimptestresults)
		.replace('{{sequencetestresults}}', userData.sequencetestresults)
		.replace('{{typingtestresults}}', userData.typingtestresults)
		.replace('{{verbaltestresults}}', userData.verbaltestresults)
		.replace('{{visualtestresults}}', userData.visualtestresults)
		.replace('{{aimtestresults}}', userData.aimtestresults)
		.replace('{{reactiontestresults}}', userData.reactiontestresults)
		.replace('{{numbermemorytestresults}}', userData.numbermemorytestresults);

	res.send(dynamicHTML);
});

app.post('/logresult/:testNumber', (req, res) => {
	const testNumber = parseInt(req.params.testNumber);

	switch (testNumber) {
		case 1:
			chimptest();
			break;
		case 2:
			sequencememory();
			break;
		case 3:
			typing();
			break;
		case 4:
			verbalmemory();
			break;
		case 5:
			;
			visualmemory();
			break;
		case 6:
			aim();
			break;
		case 7:
			reactiontime();
			break;
		case 8:
			numbermemory();
			break;
		default:
			console.log('Invalid Test Number');
	}

	res.sendStatus(200);
});


app.listen(port, async () => {
	try {
		const browser = await puppeteer.launch({
			headless: false
		});

		const page = await browser.newPage();
		await page.goto('http://localhost:80');
	} catch (error) {
		console.error("An error occurred:", error);
		fs.writeFileSync('error.txt', error.toString());
	}
});


let config = {};

if (fs.existsSync('config.json')) {
	config = JSON.parse(fs.readFileSync('config.json'));
}

async function reactiontime() {
	try {
		const browser = await puppeteer.launch({
			headless: false
		});
		const page = await browser.newPage();
		await puppeteerLogin(page);

		await page.waitForSelector('a[href="/tests/reactiontime"]');
		const click = await page.$('a[href="/tests/reactiontime"]');
		if (click) {
			await click.scrollIntoView();
			await click.click();
		}

		for (let i = 0; i < 5; i++) {
			await page.waitForSelector('div.css-42wpoy.e19owgy79');
			await page.click('div.css-42wpoy.e19owgy79');

			await page.waitForFunction(() => {
				const reactionTimeElement = document.querySelector('.view-go.e18o0sx0.css-saet2v.e19owgy77');
				return reactionTimeElement !== null;
			});

			await page.click('.view-go.e18o0sx0.css-saet2v.e19owgy77');
		}
	} catch (error) {
		console.error("An error occurred:", error);
		fs.writeFileSync('error.txt', error.toString());
	}
}

async function typing() {
	try {
		const browser = await puppeteer.launch({
			headless: false
		});
		const page = await browser.newPage();
		await puppeteerLogin(page);

		await page.waitForSelector('a[href="/tests/typing"]');
		const click = await page.$('a[href="/tests/typing"]');
		if (click) {
			await click.scrollIntoView();
			await click.click();
		}

		await page.waitForSelector('div.desktop-only.css-1qvtbrk.e19owgy78', {
			timeout: 10000
		});

		const textData = await page.evaluate(() => {
			const element = document.querySelector('div.desktop-only.css-1qvtbrk.e19owgy78');
			if (element) {
				return element.textContent;
			} else {
				return 'Element not found';
			}
		});

		await page.type('div.desktop-only.css-1qvtbrk.e19owgy78', textData, {
			delay: 0
		});

	} catch (error) {
		console.error("An error occurred:", error);
		fs.writeFileSync('error.txt', error.toString());
	}
}

async function aim() {
	try {
		const browser = await puppeteer.launch({
			headless: false
		});
		const page = await browser.newPage();
		await puppeteerLogin(page);

		await page.waitForSelector('a[href="/tests/aim"]');
		const click = await page.$('a[href="/tests/aim"]');
		if (click) {
			await click.scrollIntoView();
			await click.click();
		}

		await page.waitForSelector('div.css-z6vxiy.e6yfngs3');

		while (true) {
			const element = await page.$('div.css-z6vxiy.e6yfngs3');
			if (element) {
				await element.click();
			} else {
				break;
			}
		}

	} catch (error) {
		console.error("An error occurred:", error);
		fs.writeFileSync('error.txt', error.toString());
	}
}

async function chimptest() {
	try {
		const browser = await puppeteer.launch({
			headless: false,
		});
		const page = await browser.newPage();
		await puppeteerLogin(page);

		await page.waitForSelector('a[href="/tests/chimp"]');
		const click = await page.$('a[href="/tests/chimp"]');
		if (click) {
			await click.scrollIntoView();
			await click.click();
		}

		await killads(page)

		let f = false;

		for (let i = 0; i < 100; i++) {
			await page.waitForSelector('button.css-de05nr.e19owgy710');
			await page.click('button.css-de05nr.e19owgy710');

			await page.waitForSelector('div > div.css-k008qs');

			let cellNumber = 1;
			while (true) {
				const cellElement = await page.$(`[data-cellnumber="${cellNumber}"]`);
				if (!cellElement) {
					break;
				}
				await cellElement.click();
				cellNumber++;

				const buttonExists = await page.$('button.css-qm6rs9.e19owgy710');
				if (buttonExists) {
					f = true;
					break;
				}
			}

			if (f) {
				break;
			}

		}

	} catch (error) {
		console.error("An error occurred:", error);
		fs.writeFileSync('error.txt', error.toString());
	}
}

const wordArray = [];

async function verbalmemory() {
	try {
		const browser = await puppeteer.launch({
			headless: false,
		});
		const page = await browser.newPage();
		await puppeteerLogin(page);

		await page.waitForSelector('a[href="/tests/verbal-memory"]');
		const click = await page.$('a[href="/tests/verbal-memory"]');
		if (click) {
			await click.scrollIntoView();
			await click.click();
		}

		await page.waitForSelector('button.css-de05nr.e19owgy710');
		await new Promise(wait => setTimeout(wait, 1000));
		await page.click('button.css-de05nr.e19owgy710');

		const wordArray = [];

		for (let i = 0; i < 500; i++) {
			await page.waitForSelector('div.word');
			const wordElement = await page.$('div.word');
			const word = await page.evaluate((element) => element.textContent, wordElement);

			if (wordArray.includes(word)) {
				await page.evaluate(() => {
					const buttons = document.querySelectorAll('button');
					for (const button of buttons) {
						if (button.textContent.includes('SEEN')) {
							button.click();
							break;
						}
					}
				});
			} else {
				await page.evaluate(() => {
					const buttons = document.querySelectorAll('button');
					for (const button of buttons) {
						if (button.textContent.includes('NEW')) {
							button.click();
							break;
						}
					}
				});
				wordArray.push(word);
			}
		}

		for (let i = 0; i < 3; i++) {
			await page.evaluate(() => {
				const buttons = document.querySelectorAll('button');
				for (const button of buttons) {
					if (button.textContent.includes('SEEN')) {
						button.click();
						break;
					}
				}
			});
		}

	} catch (error) {
		console.error("An error occurred:", error);
		fs.writeFileSync('error.txt', error.toString());
	}
}

async function sequencememory() {
	try {
		const browser = await puppeteer.launch({
			headless: false,
		});
		const page = await browser.newPage();
		await puppeteerLogin(page);

		await page.waitForSelector('a[href="/tests/sequence"]');
		const click = await page.$('a[href="/tests/sequence"]');
		if (click) {
			await click.scrollIntoView();
			await click.click();
		}

		await page.waitForSelector('button.css-de05nr.e19owgy710');
		await page.click('button.css-de05nr.e19owgy710');

		let previousLevel = null;
		let previousSquareStates = [];
		let timer = null;
		const noActiveTimeout = 2000;
		let clickQueue = [];
		await killads(page);

		const interval = setInterval(async () => {
			await page.waitForSelector('.css-dd6wi1 span');

			const level = await page.evaluate(() => {
				try {
					const selector = document.querySelector('.css-dd6wi1 span:nth-child(2)');
					return selector.innerText;
				} catch (err) {
					console.log("No inner text detected, level must have failed");
					return null;
				}
			});

			if (level !== previousLevel) {
				previousLevel = level;
				clickQueue = [];
				if (level === "100") {
					const totalSquares = 9;
					const incorrectClicks = 3;
					for (let i = 0; i < incorrectClicks; i++) {
						const randomSquare = Math.floor(Math.random() * totalSquares);
						clickQueue.push(randomSquare);
					}
					clickSquaresInOrder(page, clickQueue);
				}
			}

			const currentSquareStates = await page.evaluate(() => {
				try {
					const squares = Array.from(document.querySelectorAll('.squares .square'));
					return squares.map(square => square.classList.contains('active'));
				} catch (err) {
					console.log("Error detecting square states");
					return [];
				}
			});

			for (let i = 0; i < currentSquareStates.length; i++) {
				if (currentSquareStates[i] !== previousSquareStates[i]) {
					if (currentSquareStates[i]) {
						clearTimeout(timer);
						timer = setTimeout(() => {
							clickSquaresInOrder(page, clickQueue);
						}, noActiveTimeout);
						clickQueue.push(i);
					}
				}
			}

			previousSquareStates = currentSquareStates;
		}, 30);

	} catch (error) {
		console.error("An error occurred:", error);
		fs.writeFileSync('error.txt', error.toString());
	}
}



async function clickSquaresInOrder(page, clickQueue) {
	for (const squareIndex of clickQueue) {
		const squares = await page.$$('.squares .square');
		if (squares.length > squareIndex) {
			const square = squares[squareIndex];
			await square.click();
		}
	}
}

async function numbermemory() {
	try {
		const browser = await puppeteer.launch({
			headless: false,
		});
		const page = await browser.newPage();
		await puppeteerLogin(page);

		await page.waitForSelector('a[href="/tests/number-memory"]');
		const click = await page.$('a[href="/tests/number-memory"]');
		if (click) {
			await click.scrollIntoView();
			await click.click();
		}

		await page.waitForSelector('button.css-de05nr.e19owgy710');
		await new Promise(wait => setTimeout(wait, 1000));
		await page.click('button.css-de05nr.e19owgy710');
		killads(page)

		for (let i = 0; i < 50; i++) {
			await page.waitForSelector('.big-number');
			const element = await page.$('.big-number');
			const text = await page.evaluate(element => element.textContent, element);
			await page.waitForSelector('input[pattern="[0-9]*"]')
			await page.type('input[pattern="[0-9]*"]', text);
			await page.waitForSelector('button.css-de05nr.e19owgy710');
			await page.click('button.css-de05nr.e19owgy710');
			await page.waitForSelector('button.css-de05nr.e19owgy710');
			await page.click('button.css-de05nr.e19owgy710');
		}

	} catch (error) {
		console.error("An error occurred:", error);
		fs.writeFileSync('error.txt', error.toString());
	}
}

async function visualmemory() {
	try {
		const browser = await puppeteer.launch({
			headless: false,
		});
		const page = await browser.newPage();
		await puppeteerLogin(page);

		await page.waitForSelector('a[href="/tests/memory"]');
		const click = await page.$('a[href="/tests/memory"]');
		if (click) {
			await click.scrollIntoView();
			await click.click();
		}

		await page.waitForSelector('button.css-de05nr.e19owgy710');
		await page.click('button.css-de05nr.e19owgy710');

		let previousLevel = null;

		await page.waitForSelector('.css-dd6wi1');
		await killads(page)

		const interval = setInterval(async () => {
			try {
				const level = await page.evaluate(() => {
					try {
						const selector = document.querySelector('.css-dd6wi1 span:nth-child(2)');
						return selector.innerText;
					} catch (err) {
						console.log("No inner text detected, level must have failed");
						return null;
					}
				});

				if (level !== previousLevel) {
					try {
						previousLevel = level;
						await page.waitForSelector('.active.css-lxtdud.eut2yre1', {
							timeout: 0
						});
						const activeSquares = await page.$$('.active.css-lxtdud.eut2yre1');
						for (const square of activeSquares) {
							setTimeout(async () => {
								try {
									await square.click();
								} catch (err) {}
							}, 1500);
						}
					} catch (err) {}
				}
			} catch (err) {}
		}, 30);

	} catch (error) {
		console.error("An error occurred:", error);
		fs.writeFileSync('error.txt', error.toString());
	}
}

async function puppeteerLogin(page) {
	try {
		await page.goto('https://humanbenchmark.com/login');

		const configData = JSON.parse(fs.readFileSync('config.json'));
		const username = configData.username;
		const password = configData.password;

		await page.waitForSelector('input[name="username"]');
		await page.type('input[name="username"]', username);

		await page.type('input[name="password"]', password);

		await page.click('input[type="submit"].css-z5gx6u.e19owgy712');
		await page.waitForNavigation();
	} catch (error) {
		console.error("An error occurred:", error);
		fs.writeFileSync('error.txt', error.toString());
	}
}

async function killads(page) {
	try {
		await page.waitForSelector('.vm-footer-content');

		await page.evaluate(() => {
			const element = document.querySelector('.vm-footer-content');
			if (element) {
				element.remove();
			}
		});
	} catch (error) {
		console.error("An error occurred:", error);
		fs.writeFileSync('error.txt', error.toString());
	}
}