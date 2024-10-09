"""
Basic example of a Mkdocs-macros module
"""

def define_env(env):

    @env.macro
    def get_title_by_url(url, pages):
        for page in pages:
            if page.url == url:
                print(page.url)
                for line in page.content.splitlines():
                    if line.startswith('# '):
                        return line[2:]  # Return the title without the '# '
                    elif line.startswith('## '):
                        return line[3:]  # Return the title without '## '
        return url  # If no matching page is found
