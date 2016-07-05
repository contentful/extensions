# Uncomment the lines below after adding your data
# export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=<your token>
# export SPACE=<id of space you want to install the extension for>

BIN=./node_modules/.bin

build: index.built.html

# Inject all javascript files into 'index.html' to produce 'index.built.html'
index.built.html: app.js index.html
	cp index.html $@
	echo "<script>" >> $@
	$(BIN)/browserify -d -t [ babelify --presets [ es2015 ] ] --entry $<  >> $@
	echo "</script>" >> $@

.PHONY: build index.built.html

create: extension.json index.built.html
	contentful-extension create --space-id ${SPACE}

update: extension.json index.built.html
	contentful-extension update --space-id ${SPACE} --force

update-dev: extension.json index.built.html
	contentful-extension update --space-id ${SPACE} --force --src 'http://localhost:8000/index.built.html'

# Or choose any of the server one-liners from
# https://gist.github.com/willurd/5720255
serve:
	python -m SimpleHTTPServer 8000
