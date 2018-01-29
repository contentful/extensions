# Uncomment and add your authentication info and space id below
# export SPACE=<id of space where you want to install this extension>

GH_PAGES_URL=https://contentful.github.io/ui-extensions-sdk/examples/chessboard/

# Run a static webserver inside 'dist'
serve: build
	cd dist && python -m SimpleHTTPServer 3000

# Move all assets to the 'dist/' directory
build:
	mkdir -p dist
	cp -fr index.html app.js vendor/chessboard/* dist/

update: extension.json
	contentful extension update --space-id $(SPACE) --force

update-gh: extension.json
	contentful extension update --space-id $(SPACE) --force --src "$(GH_PAGES_URL)"

create: extension.json
	contentful extension create --space-id $(SPACE)

.PHONY: build
