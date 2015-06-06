COMPRESS_OPT:=dead_code,drop_console,join_vars,warnings,unused
UGLIFY:=uglifyjs -o underboss.js --lint --screw-ie8 -c ${COMPRESS_OPT}  -m --stats --
JSL:=~/jsl/jsl -conf jsl.conf -nosummary -nologo -process
FILES+=`ls res/*.js`
FILES+=`ls bot/*.js`
FILES+=`ls util/*.js`
FILES+=main.js


all: combine release

combine: lint convertcss
	cat Underboss.meta.js $(FILES) > Underboss-dev.user.js

convertcss:
	@echo "Convert CSS to JS"
	@echo -n 'var css = "' > res/underboss.css.js
	@uglifycss res/underboss.css | tr -d '\n' >> res/underboss.css.js
	@echo -n '";' >> res/underboss.css.js

lint:
	@for f in $(FILES); do \
		${JSL} $$f; \
	done

release:
	${UGLIFY} Underboss-dev.user.js
	cat Underboss.meta.js underboss.js > Underboss.user.js
	rm underboss.js
