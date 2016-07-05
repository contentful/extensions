# These exports are useful when you use contentful-widget cli
# to create/read/update/delete your widget

# export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=<your access token here>
# export SPACE=<space you want to install this widget for>

build: dist/index.html

dist/app.js: app.js
	mkdir -p dist
	browserify \
	-t [ babelify --presets es2015 --sourceMapRelative .] \
	--entry $^ \
	--outfile $@

dist/index.html: index.html dist/app.js
	cp $< $@
	echo "<script>" >> $@
	cat dist/app.js >> $@
	echo "</script>" >> $@

clean:
	rm -f dist/*

.PHONY: build, clean
