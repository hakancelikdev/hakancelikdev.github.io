all: lint clean

.PHONY: dev
dev:
	python3.11 -m venv .venv
	source .venv/bin/activate; pip install pip -U; pip install -r requirements.txt

.PHONY: install
install:
	source .venv/bin/activate; pip install -r requirements.txt

.PHONY: lint
lint:
	git add .
	source .venv/bin/activate; pre-commit run --all-files

.PHONY: clean
clean:
	rm -rf `find . -name __pycache__`
	rm -f `find . -type f -name '*.py[co]' `
	rm -f `find . -type f -name '*~' `
	rm -f `find . -type f -name '.*~' `
	rm -rf .cache
	rm -rf .pytest_cache
	rm -rf .mypy_cache
	rm -rf htmlcov
	rm -rf *.egg-info
	rm -f .coverage
	rm -f .coverage.*
	rm -rf .tox
	rm -rf build
	rm -rf site

.PHONY: docs
docs:
	source .venv/bin/activate; mkdocs serve

.PHONY: build
build:
	source .venv/bin/activate; mkdocs build

.PHONY: deploy
deploy:
	source .venv/bin/activate; mkdocs gh-deploy

.PHONY: push
push:
	git push origin head

.PHONY: amend
amend:
	git add .
	git commit --amend --no-edit
	git push origin head -f

.PHONY: git
git:
	git config --local user.email "hakancelikdev@gmail.com"
	git config --local user.name "Hakan Celik"

.PHONY: sync-main
sync-main:
	git fetch origin main
	git rebase origin/main
