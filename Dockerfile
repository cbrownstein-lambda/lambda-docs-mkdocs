FROM squidfunk/mkdocs-material:9
RUN pip install mkdocs-charts-plugin \
                mkdocs-git-committers-plugin-2 \
                mkdocs-git-revision-date-localized-plugin \
                mkdocs-include-markdown-plugin mkdocs-material[imaging] \
                mkdocs-redirects
