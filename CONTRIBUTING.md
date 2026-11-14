# Contributing to WeConnect

Create a feature branch for your work, push that branch and open a pull request
against main. Rakan reviews and merges changes; contributors must not update or
merge main directly. GitHub rules must enforce this policy before collaborator
write access is enabled. Do not push .env files, local mail, database backups,
node_modules or generated builds.

```bash
git switch -c feature/short-description
git add .
git commit -m "Describe the change"
git push -u origin feature/short-description
```

Run npm run lint before a pull request. Also run npm run build.
