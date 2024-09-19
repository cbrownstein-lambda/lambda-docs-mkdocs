# Contributing to Lambda Docs

Thank you for considering contributing to
[Lambda Docs](https://docs.lambdalabs.com)! We welcome contributions in all
forms, including bug reports, requests for new documentation, and pull requests.
Below are guidelines to ensure a quick and easy contribution process.

## Bug reports, improvements, and new documentation

If you find any issues with the documentation (for example, outdated content,
broken links, or broken styling), or have suggestions for improvements or new
documentation, please
[create an issue](https://github.com/cbrownstein-lambda/lambda-docs-mkdocs/issues/new)
in GitHub.

## Pull requests

If you want to create a pull request (thank you!) to fix a bug, improve existing
documentation, or contribute new documentation, we recommend that you first
[create an issue](https://github.com/cbrownstein-lambda/lambda-docs-mkdocs/issues/new)
in GitHub. This reduces the likelihood of you duplicating efforts with someone
else.

Please follow these guidelines when creating a pull request:

- **Write in Markdown**. Use HTML only when necessary. If you're not familiar
  with Markdown, see
  [Daring Fireball's guide on Markdown syntax](https://daringfireball.net/projects/markdown/syntax).
- **Format external links and links to PDFs**.
    - Format external links as follows: `[LINK TEXT :octicons-link-external-16:](URL){target="_blank"}`.
      This formatting appends
      ![External link icon](docs/assets/images/octicon--link-external.svg) to
      the link text to indicate an external link. The link also opens in a new
      tab.
    - Format links to PDFs as follows:
      `[:material-file-pdf-box: LINK TEXT](URL){target="_blank"}`. This
      formatting prefaces the link text with
      ![PDF icon](docs/assets/images/mdi--file-pdf-box.svg) to indicate the link
      is to a PDF. Don't preface the link text with
      `:octicons-link-external-16:` even if the link is to an external site.
- **Adhere to the Microsoft Writing Style Guide**. Please try your best to
  adhere to the
  [Microsoft Writing Style Guide](https://learn.microsoft.com/en-us/style-guide/welcome/)
  if possible. However, don't let this discourage you from contributing. We're
  happy to help edit your work!
- **Wrap lines at 80 characters**. Treat links and images as single words. If a
  link or image causes a line to exceed 80 characters in length, wrap it to a
  new line. **Note**: It doesn't always make sense to wrap lines at 80
  characters. Do what you think is best, keeping readability in mind.

## Thank you!

Thank you for contributing to Lambda Docs! Your efforts make our documentation
better for everyone!
