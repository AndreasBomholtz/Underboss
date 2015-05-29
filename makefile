COMPRESS_OPT:=dead_code,drop_console,join_vars,warnings,unused
UGLIFY:=uglifyjs -o underboss.js --screw-ie8 -c ${COMPRESS_OPT}  -m --stats --
JSL:=jsl -conf jsl.conf -nosummary -nologo -process
FILES+=`ls res/*.js`
FILES+=`ls bot/*.js`
FILES+=`ls util/*.js`
FILES+=main.js

combine: lint
	cat Underboss.meta.js $(FILES) > Underboss-dev.user.js

lint:
	@for f in $(FILES); do \
		${JSL} $$f; \
	done

compile: lint
	${UGLIFY} $(FILES)
	cat Underboss.meta.js underboss.js > Underboss.user.js
	rm underboss.js
