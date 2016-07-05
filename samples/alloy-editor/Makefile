# Uncomment the lines below after adding your data
# export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=<your token here>
# export SPACE=<id of space where you want to install this extension>

serve:
	python -m SimpleHTTPServer 3000

update: extension.json
	contentful-extension update --space-id $(SPACE)

update-local: extension.json
	contentful-extension update --space-id $(SPACE) --force --src http://localhost:3000

update-force: extension.json
	contentful-extension update --space-id $(SPACE) --force

create: extension.json
	contentful-extension create --space-id $(SPACE)

delete:
	contentful-extension delete --space-id $(SPACE) --id alloy
