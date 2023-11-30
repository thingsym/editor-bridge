'use strict';

// node src/helper/fontawesome-yml2json-convert/index.js > src/helper/fontawesome-yml2json-convert/fontawesome-converted-data.js

const yaml = require('js-yaml');
const fs   = require('fs');

try {
	const doc = yaml.load(fs.readFileSync('./node_modules/@fortawesome/fontawesome-free/metadata/icons.yml', 'utf8'));
	let data = [];
	Object.keys(doc).forEach(
		(key) => {
			if (doc[key].styles.includes('solid')) {
				data.push(
					{
						label: key,
						class: 'fas' + ' fa-' + key,
						unicode: doc[key].unicode
					}
				);
			}
		}
	);

	console.log(JSON.stringify(data, null , "\t"));

} catch (e) {
  console.log(e);
}
