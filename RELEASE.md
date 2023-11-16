## Publishing

To publish a new version of this package, follow these steps:

1. Update the version number with the `npm version` command. Be sure to follow semantic versioning rules.

2. Generate the changelog using lerna-changelog. This tool uses pull request labels to categorize changes. Run the following command:

```
GITHUB_AUTH=[GITHUB_AUTH_CODE_HERE] yarn changelog
```

This will output the changelog to the console. Copy this output and prepend it to the `CHANGELOG.md` file.

3. Commit the changes to `CHANGELOG.md` and `package.json` with a message like "Release v<version>".

4. Push the commit and tag to the repository. Use the following command:

```
git push && git push --tags
```

5. The release workflow will automatically run on GitHub Actions when the tag is pushed.
