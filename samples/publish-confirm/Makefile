build: clean compile concat

compile:
	@parcel build src/index.jsx -d ./build --no-source-maps > /dev/null
	@-rm build/index.map

concat:
	@sed -n '1,/<\/body>/ p' ./src/index.html | head -n -1 > ./build/index.html
	@echo '<script type="text/javascript">' >> ./build/index.html
	@cat build/index.js >> ./build/index.html
	@echo '</script>' >> ./build/index.html
	@awk '/<\/body>/{y=1;}y' src/index.html >> ./build/index.html
	@-rm build/index.js

clean:
	@rm -rf ./build/*
